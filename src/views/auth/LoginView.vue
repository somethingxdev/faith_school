<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-3xl font-medium mb-7.5">Добро пожаловать</h1>
    <form @submit="onSubmit" class="grid gap-2.5">
      <FormField v-slot="{ componentField }" name="username">
        <FormItem>
          <FormControl>
            <Input type="text" placeholder="Email" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormControl>
            <Input type="password" placeholder="Пароль" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <a href="#" class="font-medium mb-4"> Забыли пароль? </a>
      <Button type="submit"> Войти </Button>
    </form>
  </div>
</template>
