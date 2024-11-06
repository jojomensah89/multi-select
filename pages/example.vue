<template>
  <div class="p-8 space-y-8">
    <!-- Basic Single Select -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700"
        >Single Select</label
      >
      <MultiSelect
        v-model="singleValue"
        :options="countries"
        placeholder="Select a country"
        class="w-[300px]"
      />
      <div class="text-sm text-gray-500">Selected: {{ singleValue }}</div>
    </div>

    <!-- Multiple Select with Search -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700"
        >Multiple Select with Search</label
      >
      <MultiSelect
        v-model="multipleValues"
        :options="countries"
        :multiple="true"
        placeholder="Select countries"
        class="w-[300px]"
      />
      <div class="text-sm text-gray-500">Selected: {{ multipleValues }}</div>
    </div>

    <!-- Disabled Options Example -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700"
        >With Disabled Options</label
      >
      <MultiSelect
        v-model="disabledValue"
        :options="optionsWithDisabled"
        placeholder="Select options"
        class="w-[300px]"
      />
    </div>

    <!-- Loading State -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700"
        >Loading State</label
      >
      <MultiSelect
        v-model="loadingValue"
        :options="[]"
        :loading="true"
        placeholder="Loading options..."
        class="w-[300px]"
      />
    </div>

    <!-- Custom Max Display -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700"
        >Custom Max Display (max 2)</label
      >
      <MultiSelect
        v-model="maxDisplayValues"
        :options="countries"
        :multiple="true"
        :max-visible="2"
        placeholder="Select countries"
        class="w-[300px]"
      />
    </div>

    <!-- With Direction Control -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700"
        >Upward Direction</label
      >
      <MultiSelect
        v-model="directionValue"
        :options="countries"
        direction="up"
        multiple
        placeholder="Opens upward"
        class="w-[300px]"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700"
        >Upward Direction</label
      >
      <MultiSelect
        multiple
        v-model="directionValue"
        :options="countries"
        placeholder="Opens upward"
        class="w-[300px]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MultiSelect from '~/components/multiselect/BaseMultiselect';

import type { Option } from './components/types';

// Sample data
const countries: Option[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
];

const optionsWithDisabled: Option[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2', disabled: true },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4', disabled: true },
  { value: '5', label: 'Option 5' },
];

// State management
const singleValue = ref<string | null>(null);
const multipleValues = ref<string[]>([]);
const disabledValue = ref<string | null>(null);
const loadingValue = ref<string | null>(null);
const maxDisplayValues = ref<string[]>([]);
const directionValue = ref<string | null>(null);

// Optional: Example of handling search
const handleSearch = (query: string) => {
  console.log('Search query:', query);
};
</script>

<script lang="ts">
// Type declarations
export interface ExampleProps {
  modelValue: string | string[] | null;
}
</script>
