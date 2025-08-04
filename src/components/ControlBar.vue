<script setup lang="ts">
import { Button, Dialog, InputText, Checkbox, Message, Toast, useToast } from "primevue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { computed, ref } from "vue";
import useDnsApi from "@/composables/DnsApi";
import useRecordStore from "@/composables/useRecordStore";
import { AxiosError } from "axios";

const initialValues = ref({
  hostname: "",
  ipAddress: "",
  addPtr: true
});

const newRecordVisible = ref(false);
const editRecordVisible = ref(false);
const hostname = ref("");
const ipAddress = ref("");
const addPtr = ref(true);
const fqdn = computed(() => hostname.value ? `${hostname.value}.${import.meta.env.VITE_DEFAULT_ZONE}.` : "");

const resolver = ref(zodResolver(
  z.object({
    hostname: z.hostname({ error: "Not a valid hostname!" }),
    ipAddress: z.ipv4({ error: "Input is not the corrent IP Address!" })
  })
));

const toast = useToast();

const { addRecord } = useDnsApi();

async function onFormSubmit(fse: FormSubmitEvent) {
  if (fse.valid) {
    try {
      await addRecord(hostname.value, ipAddress.value, addPtr.value);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        generateErrorToast(`HTTP ${e.code}: ${e.message}`);
      } else if (e instanceof Error) {
        generateErrorToast(e.message);
      } else {
        generateErrorToast("Unknown error!");
      }
    }
    toast.add({
      severity: "success",
      summary: "Validation successful",
      life: 2000
    });
    newRecordVisible.value = false;
  }

  function generateErrorToast(message: string) {
    toast.add({
      severity: "error",
      summary: message
    });
  }
}

function onEditClick() {
  editRecordVisible.value = true;
  const { selectedRecord } = useRecordStore();
  hostname.value = selectedRecord.value?.hostname ?? "";
  ipAddress.value = selectedRecord.value?.ipAddress ?? "";
}

function onDeleteClick() {

}
</script>
<template>
  <Toast position="bottom-center" severity="error" />
  <Button label="Новая запись" @click="newRecordVisible = true">
    <slot name="icon">
      <img src="@/assets/add.svg" alt="plus" />
      Новая запись
    </slot>
  </Button>
  <Button label="Изменить запись" @click="onEditClick">
    <slot name="icon">
      <img src="@/assets/edit.svg" alt="edit" />
      Изменить запись
    </slot>
  </Button>
  <Button label="Удалить запись" @click="onDeleteClick">
    <slot name="icon">
      <img src="@/assets/delete.svg" alt="delete" />
      Удалить запись
    </slot>
  </Button>

  <Dialog v-model:visible="newRecordVisible" header="Добавить A-запись в DNS" modal class="w-1/3">
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

  <Dialog v-model:visible="editRecordVisible" header="Изменить A-запись в DNS" modal class="w-1/3">
    <Form v-slot="$form" :resolver="resolver" :initial-values @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
      <label for="hostname" class="font-bold w-24 self-baseline">Hostname</label>
        <div class="flex flex-col flex-auto">
          <InputText v-model="hostname" name="hostname" autocomplete="off" class="flex-auto h-8" />
          <Message v-if="$form.hostname?.invalid" severity="error" size="small" variant="simple">
            {{ $form.hostname.error.message }}
          </Message>
        </div>
      <div class="flex items-center gap-4">
        <label for="hostname" class="font-bold w-24 self-baseline">FQDN</label>
        <InputText v-model="fqdn" id="hostname" class="flex-auto h-8 p-0" readonly disabled />
      </div>
      <div class="flex items-center gap-4">
        <label for="ipAddress" class="font-bold w-24 self-baseline">IP Address</label>
        <div class="flex flex-col flex-auto">
          <InputText v-model="ipAddress" id="ipAddress" name="ipAddress" class="flex-auto h-8 p-0" autocomplete="off" />
          <Message v-if="$form.ipAddress?.invalid" severity="error" size="small" variant="simple">
            {{ $form.ipAddress.error.message }}
          </Message>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <label for="addPtr" class="font-bold w-24">Add PTR record</label>
        <Checkbox v-model="addPtr" id="addPtr" binary />
      </div>
      <Button type="submit" severity="secondary" label="Confirm"></Button>
    </Form>
  </Dialog>
</template>