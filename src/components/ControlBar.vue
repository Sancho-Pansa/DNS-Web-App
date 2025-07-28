<script setup lang="ts">
import { Button } from "primevue";

</script>
<template>
  <Button label="Новая запись" @click="">
    <slot name="icon">
      <img src="@/assets/add.svg" alt="plus" />
      Новая запись
    </slot>
  </Button>
  <Button label="Изменить запись">
    <slot name="icon">
      <img src="@/assets/edit.svg" alt="edit" />
      Изменить запись
    </slot>
  </Button>
  <Button label="Удалить запись">
    <slot name="icon">
      <img src="@/assets/delete.svg" alt="delete" />
      Удалить запись
    </slot>
  </Button>
</template>
