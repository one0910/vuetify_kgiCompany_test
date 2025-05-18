<script setup>
import { ref, onMounted } from 'vue';
import { fromUrl } from 'geotiff';
// import tiffUrl from '/file_example_TIFF_1MB.tiff?url';
import tiffUrl from '/ag_ieasy_confirm.tiff?url';

const canvasRef = ref(null);

onMounted(async () => {
  const tiff = await fromUrl(tiffUrl);
  const image = await tiff.getImage();
  const raster = await image.readRasters({ interleave: true });
  const canvas = document.createElement('canvas');
  const width = image.getWidth();
  const height = image.getHeight();
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);

  canvas.width = width;
  canvas.height = height;

  for (let i = 0; i < width * height; i++) {
    const r16 = raster[i * 4]; // R
    const g16 = raster[i * 4 + 1]; // G
    const b16 = raster[i * 4 + 2]; // B
    const a16 = raster[i * 4 + 3]; // A (alpha)

    // 把 16-bit 值轉換成 8-bit，正常化
    const r = (r16 * 255) / 65535;
    const g = (g16 * 255) / 65535;
    const b = (b16 * 255) / 65535;
    const a = (a16 * 255) / 65535;

    imageData.data[i * 4] = r;
    imageData.data[i * 4 + 1] = g;
    imageData.data[i * 4 + 2] = b;
    imageData.data[i * 4 + 3] = a;
  }

  ctx.putImageData(imageData, 0, 0);
  canvasRef.value.appendChild(canvas);
});
</script>

<template>
  <div ref="canvasRef"></div>
</template>
