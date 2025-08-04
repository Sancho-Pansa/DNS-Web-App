<script setup lang="ts">
import { InputText, Message, Dialog, Button } from "primevue";
import { Form } from "@primevue/forms";
import { ref } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const isVisible = defineModel({
  type: Boolean,
  default: false
});

const hostname = defineModel({
  type: String,
  required: true
});

defineProps({
  header: String,
  initialValues: Object,

});

const resolver = ref(zodResolver(
  z.object({
    hostname: z.hostname({ error: "Not a valid hostname!" }),
    ipAddress: z.ipv4({ error: "Input is not the correct IP Address!" })
  })
));

</script>

<template>
  <Dialog v-model:visible="isVisible" :header="header" modal class="w-1/3">
    <Form v-slot="$form" :resolver="resolver" :initial-values @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <div class="flex items-center gap-4">
        <label for="hostname" class="font-bold w-24 self-baseline">Hostname</label>
        <div class="flex flex-col flex-auto">
          <InputText v-model="hostname" name="hostname" autocomplete="off" class="flex-auto h-8" />
          <Message v-if="$form.hostname?.invalid" severity="error" size="small" variant="simple">
            {{ $form.hostname.error.message }}
          </Message>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <label for="hostname" class="font-bold w-24 self-baseline">FQDN</label>
        <InputText v-model="fqdn" id="hostname" class="flex-auto h-8 p-0" readonly disabled />
      </div>
      <div class="flex items-center gap-4">
        <label for="ipAddress" class="font-bold w-24 self-baseline">IP Address</label>
        <div class="flex flex-col flex-auto">
          <InputText v-model="ipAddress" id="ipAddress" name="ipAddress" class="flex-auto h-8 p-0" autocomplete="off">
            {{  }}
          </InputText>
          <Message v-if="$form.ipAddress?.invalid" severity="error" size="small" variant="simple">
            {{ $form.ipAddress.error.message }}
          </Message>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <label for="addPtr" class="font-bold w-24">Add PTR record</label>
        <Checkbox v-model="addPtr" id="addPtr" binary />
      </div>
      <Button type="submit" severity="secondary" label="Add"></Button>
    </Form>
  </Dialog>
</template>