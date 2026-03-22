#!/bin/bash
# Download all images from the current CAALR Weebly site
# Run from project root: bash scripts/download-images.sh

BASE="https://nebula.wsimg.com"
KEY="?AccessKeyId=C2754E1EE27A0816AF5B&disposition=0&alloworigin=1"

mkdir -p public/uploads/{gallery,events,news,logo}

echo "=== Downloading CAALR Logo ==="
curl -sL "${BASE}/15f05fccde497e1dc46e77cb07a2c174${KEY}" -o public/uploads/logo/caalr-logo.png

echo "=== Downloading Gallery Images (67 images) ==="
GALLERY_HASHES=(
  99ea6292e9a308c943a246fe34303d29
  498fe705500bbf4d5c5ba0be61daa382
  27427ee65b08e715b8967d4e9586ee9b
  e6f6909b0813b439d85419971840fb52
  1f12856aa81877df0a3158955d47e32d
  75fa699197f07e03811d7ccfd6ff27aa
  51581d202981dda7da11c5ddab89c9f1
  af753626a21a00f9cb15d044fe38e8ff
  582a493a7ba5fb1d7fd772afb7902e05
  3fc964ac6c4a73caf08350921b1bad2b
  8b8174a8479b1ef4426b64ab9876984d
  f2575ad65b93b95824a5eb1482f85900
  83446e2688b4f8d2caba5dfd695b77ea
  94ffc796d737196f04129263abd41aab
  4d9fbcb787890f09a5c686679e01efab
  aba4854647ee45670bbb9c6ae907012a
  7838666d4002c82849c399ef06cc2c61
  da52676df9b03da28836593d0a22b6c6
  c8c7ca541a2e1cbb27ae851ed29d5809
  426a64024bf34b212437fb820b61ec3a
  ec8dc5f80dc18b3258fb234e3cef68a5
  2f7b250d3d3574e012c40fd79475ce36
  d515b469b277a504be66966d59e99c44
  1ad39f6a6476c16555f86340c3c4ce05
  1afc19c528be850bc74643bc62f97ef7
  2ba093b65dff31639d1e32f4e7f30e45
  040b071c2093b2bbc6016275e38bd4f7
  27bb5457541698ce84bbe72855db96b8
  8f8305152cdd8a72bbe014048b5c2cb0
  cd148e953e459fe2cd5c942bd4241596
  eea28cddfc71295e37d634360d29a013
  6c253e240cb6853f6670932a1d1c725d
  db670edd5a250019c36ec78defe91c9c
  17737d0cfd5715a11914424423838afd
  29d3aa992dedc5a653011836d07d7c69
  66ec52ab98c5eb9a688962b2c9d1bf3d
  586b85c3993659651a21455eeb22048b
  e652de917ff96b7f384ed470cfba560a
  f08065e455e5072cf956bf1fe26f2e00
  cd3196a80590f17b7c5592fd75a02ae2
  97c46851ca532b712dda16d38c97dc91
  98e9ce4dfb2350a4bfe09859450c787b
  e056ce1298e68319d28ea44647d74148
  be4f133eb16ec787106d3dc7ad8868a2
  96c200c442ad37ee6494b0a3aa9b5bc6
  307c2b28f919321d6c90f6c98d8ee768
  b887f1c6ae372a4fa11c4922fb8d0dc6
  c02067c5d3df1d78a11fd70585d34252
  20f7d190cd6651018f8b6288cc271561
  a3864a013bbcd797a34d10500f8336bd
  1d476d7996b12273e66ad6f8a887b085
  91168cad198a69e6dc333bb5cae2427d
  3f7a7047d31f490383adaaccd78ea625
  b8fd251c69183a012d1a148b02508c16
  403b6a3c5adf004cf5f3c7c07f12c355
  fd6e03ef34b62465c87063902c8af3ee
  590a3086724c227b3331270436e6b3da
  4cb1eec1de35ce42a09a8ed038d100b1
  d4f90dafc25e29a095d78fc994550597
  39f9efb023f6313405df1fd892e71f0a
  45bdb02f2e215dc23876a7ebf30ad2e5
  d7888468c7357bf159c5f9d4e35e2788
  79f48ef7a78dca154a45d79403d71b53
  9c3b8d80a04834925e80b7ad946b92a5
)

i=1
for hash in "${GALLERY_HASHES[@]}"; do
  printf "  Gallery %02d/%02d: %s\n" $i ${#GALLERY_HASHES[@]} "$hash"
  curl -sL "${BASE}/${hash}${KEY}" -o "public/uploads/gallery/gallery-$(printf '%03d' $i).jpg"
  ((i++))
done

echo "=== Downloading News Images ==="
curl -sL "${BASE}/fe197e2afb427e9f0317a673e670572e${KEY}" -o public/uploads/news/carol-krah.jpg
curl -sL "${BASE}/e15039240d1238b8b85c67d4bd0c4f6f${KEY}" -o public/uploads/news/elaine-vaughn.jpg
curl -sL "${BASE}/4cae4b16477110bab6e7929529e6a295${KEY}" -o public/uploads/news/wilma-kroese.jpg

echo "=== Downloading Show Images (sample) ==="
SHOW_HASHES=(
  c22f2e59a4e9250c8df17a7d1540fec9
  7701e4d1b5e99b6fab50750373eab5bd
  f1651f74a67b77616e3d39dffa4e5856
  73333cfed4c90fe36990b26546c7da7b
  5183a5095eb2482b8c816900aa4c7b9b
)

j=1
for hash in "${SHOW_HASHES[@]}"; do
  printf "  Show %d/%d\n" $j ${#SHOW_HASHES[@]}
  curl -sL "${BASE}/${hash}${KEY}" -o "public/uploads/events/show-$(printf '%03d' $j).jpg"
  ((j++))
done

echo "=== Downloading Homepage Images ==="
HP_HASHES=(
  7dc349595a8d794654e9734936f54c73
  afa8e15a50df0cc534e8bb7da32c0214
  54bf022cb7c2cedae9deb938ed434795
  97dfd5c32c8285ae1539b1c7a405b04a
  d870f6a00e2a94565448973a5ba1a80c
)

k=1
for hash in "${HP_HASHES[@]}"; do
  printf "  Homepage %d/%d\n" $k ${#HP_HASHES[@]}
  curl -sL "${BASE}/${hash}${KEY}" -o "public/uploads/gallery/homepage-$(printf '%03d' $k).jpg"
  ((k++))
done

echo ""
echo "=== Download Complete ==="
echo "Gallery images: $(ls -1 public/uploads/gallery/ 2>/dev/null | wc -l)"
echo "News images: $(ls -1 public/uploads/news/ 2>/dev/null | wc -l)"
echo "Event images: $(ls -1 public/uploads/events/ 2>/dev/null | wc -l)"
echo "Logo: $(ls -1 public/uploads/logo/ 2>/dev/null | wc -l)"
