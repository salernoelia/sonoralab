<template>
  <div class="body">
    <div class="gallery-container">
      <div class="gallery">
        <div v-for="image in images" :key="image.id" class="image-container">
          <nuxt-link :to="`performance/${image.id}`">
            <img :src="image.url.data.publicUrl" alt="Gallery Image" />
            <div class="image-metadata">
              <p>{{ image.performance_name }}</p>
              <p>Performance {{ image.performance_id }}</p>
              <p>{{ image.updated_at }}</p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const images = ref([]);
let metadata = ref([]);

const fetchMeta = async () => {
  console.log("Fetching Metadata...");
  const { data: metadata, error } = await supabase
    .from("sketchesMeta")
    .select("*");

  fetchImages(metadata);
};

const fetchImages = async (metadata) => {
  const { data: files, error: filesError } = await supabase.storage
    .from("sketches")
    .list("sketches/");

  // console.log("Files:", files);
  if (filesError) {
    console.error("Error fetching files:", filesError);
    return;
  }

  // console.log("Metadata", metadata);

  // console.log("Unfiltered Files:", files);

  // Filter out files that match metadata.path
  const matchingFiles = [];

  // Iterate over each metadata object
  metadata.forEach((meta) => {
    // Find the corresponding file in the files array
    const matchingFile = files.find((file) => file.name === meta.name);

    // If a matching file is found, add it to the matchingFilesArray
    if (matchingFile) {
      matchingFiles.push({
        ...matchingFile,
        created_at: meta.created_at,
        performance_name: meta.performance_name,
        performance_id: meta.id,
        path: meta.path,
        url: supabase.storage.from("sketches").getPublicUrl(`${meta.path}`),
      });
      // console.log("Matching File:", matchingFile.created_at);
    }
  });

  // console.log("Matching Files:", matchingFiles);

  // matchingFiles.sort((a, b) => {
  //   return new Date(a.created_at) - new Date(b.created_at);
  // });

  // console.log("Sorted Files:", matchingFiles);

  images.value = matchingFiles;
};

onMounted(fetchMeta);
const timer = setInterval(fetchMeta, 1000);
onUnmounted(() => clearInterval(timer));
</script>

<style lang="scss" scoped>
.body::-webkit-scrollbar {
  display: none;
}

.gallery-container:-webkit-scrollbar {
  display: none;
}
body:-webkit-scrollbar {
  display: none;
}
.body {
  overflow-y: hidden; /* Hide vertical scrollbar */
  overflow-x: hidden; /* Hide horizontal scrollbar */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.gallery-container {
  display: flex;

  position: absolute;
  inset: 0;
  padding: 1rem;

  overflow-y: hidden; /* Hide vertical scrollbar */
  overflow-x: hidden; /* Hide horizontal scrollbar */
}

.gallery {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  overflow-y: scroll;
}

.image-container {
  width: 100%;
  height: 0;
  padding-top: 100%; /* Create a quadratic container */
  position: relative;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-metadata {
  position: absolute;
  bottom: 0;
  color: rgb(255, 255, 255);
  mix-blend-mode: difference;
  text-align: left;
  padding: 0.8rem;
  // background-color: rgba(0, 0, 0, 0.2);
}
</style>
