import type { KmNode } from '../../types';

export const storage: KmNode = {
  title: 'Storage',
  level: 'beginner',
  summary: 'Object storage (S3), disks for one server (EBS) and shared file systems (EFS).',
  simple:
    'S3 is a huge online warehouse for boxes. EBS is the hard drive plugged into one computer. EFS is a shared network drive the whole office can open.',
  points: [
    'S3 stores files as objects, reached by HTTP API, almost unlimited size.',
    'EBS is block storage, attached to one EC2 instance in one AZ.',
    'EFS is a file system many Linux servers can mount at once.',
  ],
  children: [
    {
      title: 'S3 Basics',
      level: 'beginner',
      summary: 'Store any file (object) in a bucket under a key, and read it back over HTTPS.',
      simple:
        'A bucket is a giant labelled box; the key is the label on each item inside. You ask for “photos/cat.jpg” and S3 hands it over.',
      points: [
        'Bucket names are globally unique. A bucket lives in one region.',
        'Objects up to 50 TB (raised from 5 TB in December 2025); folders are just key prefixes like <code>photos/</code>.',
        'Designed for 11 nines (99.999999999%) durability.',
        'Strong read-after-write consistency for all operations since December 2020.',
        'Also hosts static websites and is the default “data lake” on AWS.',
      ],
      detail: `<pre><code>S3Client s3 = S3Client.create();
s3.putObject(b -&gt; b.bucket("my-app-files").key("notes/hello.txt"),
    RequestBody.fromString("Hello S3"));

String text = s3.getObjectAsBytes(b -&gt; b.bucket("my-app-files").key("notes/hello.txt"))
    .asUtf8String();</code></pre>`,
    },
    {
      title: 'EBS Volumes',
      level: 'beginner',
      summary: 'Network-attached disks for EC2 that live in one AZ and keep data after reboots.',
      simple:
        'EBS is a USB hard drive for your virtual server. You can unplug it and plug it into another server, but only in the same building (AZ).',
      points: [
        'gp3 (general SSD) is the default: 3,000 IOPS and 125 MB/s baseline, tunable.',
        'io2 for databases needing high, steady IOPS; st1/sc1 HDD for big sequential reads.',
        'Snapshots back up volumes to S3, incrementally; copy them to move across AZs or regions.',
        'Instance store disks are faster but lost when the instance stops.',
      ],
    },
    {
      title: 'Storage Classes',
      level: 'intermediate',
      summary: 'Price tiers for how often you read your data: hot, warm, cold, frozen.',
      simple:
        'Like keeping clothes: the ones you wear daily in the wardrobe, winter coats in the attic, old photos in a storage unit across town.',
      points: [
        'Standard: frequent access. Standard-IA and One Zone-IA: cheaper, but you pay per read.',
        'Intelligent-Tiering: moves objects between tiers for you based on use.',
        'Glacier Instant Retrieval: archive with millisecond reads.',
        'Glacier Flexible Retrieval and Deep Archive: cheapest, restores take minutes to hours.',
        'Colder classes have minimum storage days and retrieval fees.',
      ],
      tip: 'Not sure about access patterns? Intelligent-Tiering is a safe default for long-lived data.',
    },
    {
      title: 'Versioning & Lifecycle',
      level: 'intermediate',
      summary: 'Keep old versions of objects, and move or delete objects automatically over time.',
      simple:
        'Versioning is “undo history” for each file. Lifecycle rules are a cleaning schedule: “move to the attic after 30 days, throw out after a year”.',
      points: [
        'With versioning on, overwrite and delete keep the old version (delete adds a marker).',
        'Protects against accidents and ransomware; pair with MFA Delete or Object Lock.',
        'Lifecycle rules transition objects to cheaper classes or expire them.',
        'Expire old noncurrent versions too, or your bill keeps growing.',
        'Replication (CRR/SRR) copies objects to another bucket or region; needs versioning.',
      ],
    },
    {
      title: 'S3 Security',
      level: 'intermediate',
      summary: 'Who can read your buckets, and how the data is encrypted.',
      simple:
        'A bucket is a locked room by default. You hand out keys (IAM) or put a sign on the door (bucket policy) to let specific people in.',
      points: [
        'New buckets block all public access and disable ACLs by default (since April 2023).',
        'All new objects are encrypted at rest (SSE-S3) by default since January 2023.',
        'Use SSE-KMS when you need key control and audit of every decrypt.',
        'Bucket policies can force HTTPS and limit access to one VPC endpoint.',
        'Serve public files through CloudFront with Origin Access Control, not a public bucket.',
      ],
      tip: 'Public S3 buckets are the top source of cloud data leaks. Keep Block Public Access on at the account level.',
    },
    {
      title: 'Presigned URLs',
      level: 'intermediate',
      summary: 'A temporary link that lets someone upload or download one object without AWS credentials.',
      simple:
        'Like a one-time guest pass: it opens one door, for a short time, then stops working.',
      points: [
        'Your backend signs the URL with its own permissions.',
        'Browsers upload straight to S3, so big files skip your server.',
        'Set a short expiry; the link works until then even if shared.',
      ],
      detail: `<pre><code>import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: 'eu-west-1' });
const url = await getSignedUrl(
  s3,
  new GetObjectCommand({ Bucket: 'invoices', Key: 'inv-42.pdf' }),
  { expiresIn: 900 }, // 15 minutes
);</code></pre>`,
    },
    {
      title: 'EFS',
      level: 'intermediate',
      summary: 'A managed NFS file system that many Linux servers and containers share at once.',
      simple:
        'A shared network drive in the office: everyone sees the same folders and files at the same time.',
      points: [
        'Grows and shrinks automatically; pay for what you store.',
        'Spans multiple AZs by default, so it survives an AZ outage.',
        'Works with EC2, ECS, EKS and Lambda.',
        'Costs more per GB than EBS or S3; use lifecycle to move cold files to IA.',
        'For Windows file shares, use FSx for Windows instead.',
      ],
    },
    {
      title: 'S3 Event Notifications',
      level: 'intermediate',
      summary: 'S3 tells other services when an object is created or deleted, so they can react.',
      simple:
        'Like a doorbell on your mailbox: when a parcel lands, it rings, and someone comes to open it.',
      points: [
        'Events like <code>ObjectCreated</code> and <code>ObjectRemoved</code>, filtered by prefix or suffix.',
        'Targets: Lambda, SQS, SNS, or EventBridge for richer rules and more targets.',
        'Classic use: user uploads a photo, a Lambda makes thumbnails.',
        'Delivery is at least once, so handle the same event twice safely.',
      ],
      detail: `<pre><code>// Lambda handler for an S3 "ObjectCreated" event
export const handler = async (event) =&gt; {
  for (const r of event.Records) {
    const bucket = r.s3.bucket.name;
    const key = decodeURIComponent(r.s3.object.key.replace(/\\+/g, ' '));
    await makeThumbnail(bucket, key);
  }
};</code></pre>`,
      tip: 'Never write the output into the same prefix that triggers the function, or it will call itself forever.',
    },
    {
      title: 'S3 Performance',
      level: 'advanced',
      summary: 'Request limits per prefix, multipart uploads and tricks for moving big data fast.',
      points: [
        'At least 3,500 writes and 5,500 reads per second per prefix; spread keys across prefixes to go higher.',
        'Single PUT is max 5 GB. Use multipart upload above ~100 MB; it is required above 5 GB.',
        'Multipart and byte-range GETs run in parallel and retry only failed parts.',
        'Transfer Acceleration uses edge locations for faster long-distance uploads.',
        'S3 Express One Zone gives single-digit millisecond latency for hot data in one AZ.',
      ],
      tip: 'In Java use the S3 Transfer Manager; it handles multipart and parallel transfers for you.',
    },
  ],
};
