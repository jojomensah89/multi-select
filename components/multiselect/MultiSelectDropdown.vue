:multiple="true"
<template>
  <div
    :id="dropdownId"
    class="absolute z-10 w-full rounded-md bg-white shadow-lg"
    :style="positionStyle"
    role="listbox"
    :aria-multiselectable="multiple"
  >
    <div v-if="enableSearch" class="sticky top-0 z-10 bg-white p-2 border-b">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="search"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Search..."
        @input="$emit('search', searchQuery)"
      />
    </div>

    <ul
      class="max-h-[250px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      role="presentation"
    >
      <template v-if="filteredOptions.length">
        <li
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          class="relative cursor-default select-none px-3 py-2 transition-colors"
          :class="{
            'bg-indigo-600 text-white': activeIndex === index,
            'bg-indigo-50': isSelected(option) && activeIndex !== index,
            'hover:bg-indigo-50 hover:text-gray-900':
              !option.disabled && activeIndex !== index,
            'opacity-50 cursor-not-allowed': option.disabled,
            'text-gray-900': !option.disabled && activeIndex !== index,
          }"
          role="option"
          :aria-selected="isSelected(option)"
          @click.stop="handleSelect(option)"
        >
          <div class="flex items-center">
            <!-- Checkbox container -->
            <div
              v-show="multiple"
              class="flex h-5 w-5 items-center justify-center rounded border"
              :class="{
                'border-white': activeIndex === index,
                'border-indigo-600 bg-indigo-600':
                  isSelected(option) && activeIndex !== index,
                'border-gray-300 bg-white':
                  !isSelected(option) && activeIndex !== index,
              }"
            >
              <!-- Checkmark SVG -->
              <svg
                v-show="isSelected(option)"
                class="h-3.5 w-3.5"
                :class="{
                  'text-white': activeIndex === index || isSelected(option),
                }"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- Option Label -->
            <span
              class="ml-3 block truncate"
              :class="{
                'font-semibold': isSelected(option),
                'font-normal': !isSelected(option),
              }"
            >
              {{ option.label }}
            </span>
          </div>
        </li>
      </template>
      <li
        v-else
        class="relative cursor-default select-none py-2 px-3 text-gray-500"
      >
        {{ searchQuery ? noResultsText : noOptionsText }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Option, Position } from './types';

const props = withDefaults(
  defineProps<{
    dropdownId: string;
    options: Option[];
    multiple: boolean;
    enableSearch: boolean;
    noOptionsText: string;
    noResultsText: string;
    activeIndex: number;
    position: Position;
    modelValue: (string | number)[] | string | number | null;
  }>(),
  {
    modelValue: () => [],
  }
);

const emit = defineEmits<{
  search: [query: string];
  select: [option: Option];
}>();

const searchInput = ref<HTMLInputElement | null>(null);
const searchQuery = ref('');

const positionStyle = computed(() => ({
  ...props.position,
  marginTop: props.position.top ? '0.25rem' : undefined,
  marginBottom: props.position.bottom ? '0.25rem' : undefined,
}));

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectedValues = computed(() => {
  if (props.modelValue === null) return [];
  return Array.isArray(props.modelValue)
    ? props.modelValue
    : [props.modelValue];
});

const isSelected = (option: Option): boolean => {
  return selectedValues.value.includes(option.value);
};

const handleSelect = (option: Option) => {
  if (option.disabled) return;
  emit('select', option);
};

defineExpose({
  searchInput,
  clearSearch: () => (searchQuery.value = ''),
});
</script>

<style scoped>
/* Custom scrollbar styles */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 6px;
}

.scrollbar-track-transparent::-webkit-scrollbar-track {
  background-color: transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
</style>
