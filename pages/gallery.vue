<template>
  <div class="main">
    <div class="body">
      <div class="gallery-container">
        <div class="info-container">
          <div class="info-container_top">
            <h1 class="title">Sonora Lab</h1>
            <p class="description">
              Welcome to the Sonora Lab. Here you can find all the performances
              created by the Sonora Lab. Click on a performance to view the
              details.
            </p>
          </div>
          <div class="info-container_bottom">
            <p class="description">A Project by:</p>
            <p class="description.bold">
              Alison Léger, Stepan Vedunov, Arno Thöni, Elia Salerno
            </p>
          </div>
        </div>

        <div class="gallery">
          <div v-for="image in images" :key="image.id" class="image-container">
            <NuxtLink :to="`/performance/${image.id}`">
              <img :src="image.url.data.publicUrl" alt="Gallery Image" />
              <div class="image-metadata">
                <p>{{ image.performance_name }}</p>
                <p>Performance {{ image.performance_id }}</p>
                <p>{{ image.updated_at }}</p>
              </div>
            </NuxtLink>
          </div>
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

  if (filesError) {
    console.error("Error fetching files:", filesError);
    return;
  }
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
    }
  });

  matchingFiles.sort((a, b) => {
    return new Date(b.performance_id) - new Date(a.performance_id);
  });

  images.value = matchingFiles;
};

onMounted(fetchMeta);
const timer = setInterval(fetchMeta, 1000);
onUnmounted(() => clearInterval(timer));
</script>

<style lang="scss" scoped>
* {
  // box-sizing: border-box;
  // font-family: "Courier New", Courier, monospace;
  font-family: "Hanken Grotesk", sans-serif;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

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
}

.gallery-container {
  display: flex;
  position: absolute;
  inset: 0;
  padding: 2rem;
}

.gallery {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 300px));
  gap: 1rem;
  justify-content: flex-end;
  overflow-y: scroll;
}

.image-container {
  padding-top: 100%; /* Create a quadratic container */
  position: relative;
  transition: all 0.4s;

  &:hover {
    //dropshadow
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3),
      0 6px 20px 0 rgba(0, 0, 0, 0.3);
  }
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
}

.info-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30%;
  text-align: left;

  .title {
    margin: 0;
  }
}

.info-container_top {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.description {
  margin: 0;
  font-size: 1rem;
  .bold {
    font-weight: bold;
  }
}
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  transform: translateX(100%);
}
.page-enter-to,
.page-leave-from {
  transform: translateX(0);
}
</style>
