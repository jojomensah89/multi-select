<template>
  <button
    type="button"
    class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
    :class="{
      'border-gray-300': !isOpen,
      'border-indigo-500 ring-2 ring-indigo-500': isOpen,
    }"
    :disabled="disabled"
    :aria-expanded="isOpen"
    :aria-controls="dropdownId"
    @click="$emit('toggle')"
  >
    <span v-if="loading" class="block truncate text-gray-500">
      Loading...
    </span>
    <div v-else-if="selectedLabels.length" class="flex flex-wrap gap-2">
      <template v-if="multiple && selectedLabels.length <= maxVisible">
        <span
          v-for="label in selectedLabels"
          :key="label"
          class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
        >
          {{ label }}
        </span>
      </template>
      <template v-else-if="!multiple && selectedLabels.length <= maxVisible">
        <span
          v-for="label in selectedLabels"
          :key="label"
          class="inline-flex items-center text-sm font-medium"
        >
          {{ label }}
        </span>
      </template>
      <template v-else>
        <span
          v-for="label in selectedLabels.slice(0, maxVisible)"
          :key="label"
          class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
        >
          {{ label }}
        </span>
        <span
          class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
        >
          +{{ selectedLabels.length - maxVisible }} more
        </span>
      </template>
    </div>
    <span v-else class="block truncate text-gray-500">
      {{ placeholder }}
    </span>

    <span class="absolute inset-y-0 right-0 flex items-center pr-2">
      <button
        v-if="clearable && selectedLabels.length"
        type="button"
        class="text-gray-400 hover:text-gray-500"
        @click.stop="$emit('clear')"
      >
        <span class="sr-only">Clear selection</span>
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <svg
        v-else
        class="h-5 w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isOpen: boolean;
    loading: boolean;
    disabled: boolean;
    clearable: boolean;
    placeholder: string;
    selectedLabels: string[];
    dropdownId: string;
    multiple: boolean;
    maxVisible?: number;
  }>(),
  {
    maxVisible: 3,
  }
);

defineEmits<{
  toggle: [];
  clear: [];
}>();
</script>
