<script setup lang="ts">
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import Input from "~/components/ui/input/Input.vue";
import { Skeleton } from '@/components/ui/skeleton'

const config = useRuntimeConfig()

const genAI = new GoogleGenerativeAI(config.public.geminiKey);

const schema = {
  description: "Riddle",
  type: SchemaType.OBJECT,
  properties: {
    riddleQuestion: {
      type: SchemaType.STRING,
      description: "Riddle question. Don't attach answer here.",
      nullable: false,
    },
    riddleAnswer: {
      type: SchemaType.STRING,
      description: "Riddle answer",
      nullable: false,
    },
  },
  required: ["riddleQuestion", "riddleAnswer"],
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

const riddlePrompt = ref('Beri saya sebuah tebak-tebakan yang belum pernah kamu berikan kepadaku sebelumnya! (dalam Bahasa Indonesia)')
const question = ref('')
const answer = ref('')

const userAnswer = ref('')
const score = ref('')

const isLoading = ref(false)

const requestRiddle = async () => {
  isLoading.value = true

  try {
    const result = await model.generateContent(riddlePrompt.value);
    const res = JSON.parse(result.response.text());
    
    question.value = res.riddleQuestion
    answer.value = res.riddleAnswer
  } catch(err) {
    console.error(err)
  }

  isLoading.value = false
}
</script>

<template>
  <div class="px-5 py-10">
    <h1 class="text-2xl my-4">Simple Riddle</h1>

    <h2>Question:</h2>
    <div class="mt-4 border rounded p-4 flex flex-col items-center gap-y-4">
      <Button @click="requestRiddle">Generate Question</Button>
      <Skeleton v-if="isLoading" class="h-8 w-full" />
      <div>{{ question }}</div>
    </div>

    <h2 class="mt-4">Answer:</h2>
    <div class="flex gap-2 mt-4">
      <Input v-model="userAnswer" type="text"/>
      <Button>Submit</Button>
    </div>
  </div>
</template>