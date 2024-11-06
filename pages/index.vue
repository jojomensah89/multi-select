<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-2xl space-y-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Single Select</h2>
        <BaseMultiselect
          v-model="singleValue"
          :options="options"
          placeholder="Select a framework"
          :multiple="false"
        />
        <div class="mt-2 text-sm text-gray-500">
          Selected value: {{ singleValue }}
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Multiple Select</h2>
        <BaseMultiselect
          v-model="multipleValue"
          :options="options"
          placeholder="Select frameworks"
          :multiple="true"
        />
        <div class="mt-2 text-sm text-gray-500">
          Selected values: {{ multipleValue }}
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Upward Direction</h2>
        <BaseMultiselect
          v-model="upwardValue"
          :options="options"
          placeholder="Select frameworks"
          direction="up"
        />
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Without Search</h2>
        <BaseMultiselect
          v-model="noSearchValue"
          :options="options"
          :enable-search="false"
          placeholder="Select frameworks"
        />
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Disabled Select</h2>
        <BaseMultiselect
          v-model="disabledValue"
          :options="options"
          placeholder="Select a framework"
          :disabled="true"
        />
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Loading State</h2>
        <BaseMultiselect
          v-model="loadingValue"
          :options="options"
          placeholder="Select a framework"
          :loading="true"
        />
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">New State</h2>
        <NewBaseMultiselect
          multipleValue
          @select="selectOption"
          :options="options"
          placeholder="Select a framework"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NewBaseMultiselect from '~/components/multiselect/BaseMultiselect';
const singleValue = ref<string | null>(null);
const multipleValue = ref<string[]>([]);
const upwardValue = ref<string | null>(null);
const noSearchValue = ref<string | null>(null);
const disabledValue = ref<string | null>(null);
const loadingValue = ref<string | null>(null);
const options = [
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'qwik', label: 'Qwik', disabled: true },
  { value: 'preact', label: 'Preact' },
  { value: 'lit', label: 'Lit' },
  { value: 'alpine', label: 'Alpine.js' },
  { value: 'ember', label: 'Ember.js' },
];
</script>
