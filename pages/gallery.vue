<template>
  <div>
    <h1>Sketches from Installation</h1>
    <div>
      <div class="gallery">
        <div v-for="image in images" :key="image.id" class="image-container">
          <img :src="image.url.data.publicUrl" alt="Doodle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = usSupabaseClient();
const images = ref([]);

// Fetch list of objects (images) in the avatars bucket
async function fetchImages() {
  try {
    console.log("Fetching images...");
    const { data, error } = await supabase.storage.from("doodles").list();
    if (error) {
      console.error("Error fetching images:", error.message);
    } else {
      // Map each image metadata to include its URL
      images.value = data.map((image) => ({
        ...image,
        url: supabase.storage.from("doodles").getPublicUrl(image.name),
      }));
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

const timer = setInterval(fetchImages, 1000);
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
