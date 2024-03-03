<template>
  <div>
    <h1>Sketches from Installation</h1>
    <div>
      <div class="gallery">
        <div
          v-for="image in imagesWithMetadata"
          :key="image.id"
          class="image-container"
        >
          <img :src="image.url" alt="Doodle" />
          <p>{{ image.metadata }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = usSupabaseClient();
const imagesWithMetadata = ref([]);

// Fetch list of objects (images) in the avatars bucket
async function fetchImages() {
  try {
    console.log("Fetching images...");
    const { data: images, error } = await supabase.storage
      .from("sketches")
      .list();
    const { data: metadata, error: metaError } = await supabase
      .from("doodlesMeta")
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
        return {
          ...image,
          metadata: metadataItem,
          url: supabase.storage.from("sketches").getPublicUrl(image.name),
        };
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
.gallery {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
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
  border: 1px solid #ccc;
}
</style>
