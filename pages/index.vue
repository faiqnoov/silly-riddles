<script setup lang="ts">
import { GoogleGenerativeAI } from "@google/generative-ai";
import Input from "~/components/ui/input/Input.vue";

const config = useRuntimeConfig()
const { parseResponseTextToHTML } = useTextParser()

const genAI = new GoogleGenerativeAI(config.public.geminiKey);
const model = genAI.getGenerativeModel({ model: config.public.genAIModel });
const prompt = ref()
const parsedHTML = ref('')

const submitPrompt = async () => {
  try {
    const result = await model.generateContent(prompt.value);
    parsedHTML.value = parseResponseTextToHTML(result.response.text() || '')
  } catch(err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="px-5 py-10">
    <h1 class="text-2xl">Ask Me Anything!</h1>
    <div class="flex gap-2 mt-4">
      <Input v-model="prompt" type="text"/>
      <Button @click="submitPrompt">Submit</Button>
    </div>

    <h2 class="mt-8">Result:</h2>
    <div class="mt-4 border rounded p-4">
      <div id="gemini-response" v-html="parsedHTML"></div>
    </div>
  </div>
</template>