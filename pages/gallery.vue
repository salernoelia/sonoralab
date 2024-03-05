<template>
  <div class="body">
    <div>
      <div class="gallery">
        <div
          v-for="image in imagesWithMetadata"
          :key="image.id"
          class="image-container"
        >
          <img :src="image.url.data.publicUrl" alt="Doodle" />
          <!-- <p class="image-metadata">{{ image.metadata }}</p> -->
          <p class="image-metadata">
            Performance: {{ image.metadata.id }} <br />
            {{ image.metadata.created_at }} <br />
            <!-- {{ image.metadata.name }} -->
          </p>
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
      .list();
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
        return {
          ...image,
          metadata: metadataItem,
          url: supabase.storage.from("sketches").getPublicUrl(image.name),
        };
      });

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
}

.body {
  background-color: #ffffff;
  top: 0;
  left: 0;
}

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
