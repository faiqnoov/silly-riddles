<script setup lang="ts">
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import Input from "~/components/ui/input/Input.vue";
import { Skeleton } from '@/components/ui/skeleton'

const config = useRuntimeConfig()

const genAI = new GoogleGenerativeAI(config.public.geminiKey);

const question = ref('')
const answer = ref('')
const userAnswer = ref('')
const score = ref('')
const reason = ref('')
const isLoadingRiddle = ref(false)
const isLoadingScore = ref(false)

const requestRiddle = async () => {
  isLoadingRiddle.value = true

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
    model: config.public.genAIModel,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const prompt = 'Beri saya sebuah tebak-tebakan yang belum pernah kamu berikan kepadaku sebelumnya! (dalam Bahasa Indonesia)'

  try {
    const result = await model.generateContent(prompt);
    const res = JSON.parse(result.response.text());
    
    question.value = res.riddleQuestion
    answer.value = res.riddleAnswer
  } catch(err) {
    console.error(err)
  }

  isLoadingRiddle.value = false
}

const evaluateAnswer = async () => {
  isLoadingScore.value = true

  const schema = {
    description: "User answer evaluation",
    type: SchemaType.OBJECT,
    properties: {
      answerScore: {
        type: SchemaType.NUMBER,
        description: "Scores are based on the accuracy of user answers with Gemini's answers on a scale of 0 to 100.",
        nullable: false,
      },
      scoreReason: {
        type: SchemaType.STRING,
        description: "Explanation of the scores given",
        nullable: false,
      },
    },
    required: ["answerScore", "scoreReason"],
  };

  const model = genAI.getGenerativeModel({
    model: config.public.genAIModel,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const prompt = `Evaluasi jawaban user dari tebak-tebakan "${question.value}" yang memiliki jawaban ${answer.value}. User menjawab "${userAnswer.value}"`

  try {
    const result = await model.generateContent(prompt);
    const res = JSON.parse(result.response.text());
    
    score.value = res.answerScore
    reason.value = res.scoreReason
  } catch(err) {
    console.error(err)
  }

  isLoadingScore.value = false
}

const reset = () => {
  question.value = ''
  answer.value = ''
  userAnswer.value = ''
  score.value = ''
  reason.value = ''
}
</script>

<template>
  <div class="px-5 py-6">
    <h1 class="text-2xl">Simple Riddle</h1>

    <div class="mt-4">
      <Skeleton v-if="isLoadingRiddle" class="h-20 w-full" />

      <div v-else>
        <Button
          v-if="!question"
          @click="requestRiddle"
          class="block mx-auto mt-20"
        >
          Generate Question
        </Button>
  
        <div v-else>
          <div class="flex justify-between items-end">
            <h2>Question:</h2>
            <Button variant="ghost" @click="reset">Reset</Button>
          </div>
          <div class="mt-4 border rounded p-4 flex flex-col items-center gap-y-4">
            <div>{{ question }}</div>
          </div>
  
          <div class="mt-4">
            <h2>Answer:</h2>
            <div class="flex gap-2 mt-4">
              <Input
                v-model="userAnswer"
                type="text"
                @keyup.enter="evaluateAnswer"
              />
              <Button @click="evaluateAnswer">Submit</Button>
            </div>
          </div>
  
          <Skeleton v-if="isLoadingScore" class="h-16 w-full mt-4" />
          
          <div v-if="!isLoadingScore && (score || reason)" class="mt-4">
            <h2>Result:</h2>
            <div class="mt-4 border rounded p-4 flex flex-col gap-y-4">
              <div>
                <div>Score: {{ score }}</div>
                <div>Explanation: {{ reason }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>