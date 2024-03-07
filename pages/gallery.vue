<template>
  <div class="body">
    <div class="gallery-container">
      <div class="gallery">
        <div
          v-for="image in imagesWithMetadata"
          :key="image.id"
          class="image-container"

        >
          <NuxtLink :to="`/performance/${image.metadata.id}`">
            
          <img :src="image.url.data.publicUrl" alt="Doodle" />

          <!-- <p class="image-metadata">{{ image.metadata }}</p> -->
          <p class="image-metadata">
            Performance: {{ image.metadata ? image.metadata.id : "N/A" }} <br />
            {{ image.metadata ? image.metadata.created_at : "N/A" }} <br />
          </p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const imagesWithMetadata = ref([]);
let sortedImages = ref([]);

// Fetch list of objects (images) in the avatars bucket
async function fetchImages() {
  try {
    console.log("Fetching images...");
    const { data: images, error } = await supabase.storage
      .from("sketches")
      .list("sketches");
    const { data: metadata, error: metaError } = await supabase
      .from("sketchesMeta")
      .select("*");
    if (error || metaError) {
      console.error(
        "Error fetching images:",
        error?.message || metaError?.message
      );
    } else {
      // Combine image data with metadata
      imagesWithMetadata.value = images.map((image) => {
        const metadataItem = metadata.find((item) => item.name === image.name);

        // url = supabase.storage.from("sketches").getPublicUrl(image.name.replace(/ /g, '%20'));
        return {
          ...image,
          metadata: metadataItem,
          url: supabase.storage
            .from("sketches")
            .getPublicUrl(`sketches/${image.name}`),
        };
      });
      console.log("Images with metadata:", imagesWithMetadata.value);
      // Sort the images after mapping
      imagesWithMetadata.value.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    }
  } catch (error) {
    console.error("Error fetching images:", error.message);
  }
}

// Fetch images on component mount
onMounted(fetchImages);

// Fetch images periodically
const timer = setInterval(fetchImages, 1000);

// Clear interval on component unmount
onUnmounted(() => clearInterval(timer));
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  font-family: "Courier New", Courier, monospace;
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
  background-color: #f3f3f3;
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
  color: rgb(251, 255, 0);
  mix-blend-mode: difference;
  text-align: left;
  padding: 0.8rem;
  // background-color: rgba(0, 0, 0, 0.2);
}
</style>
