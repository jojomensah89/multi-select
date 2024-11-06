<template>
  <div ref="containerRef" class="relative" @keydown="handleKeydown">
    <MultiSelectTrigger
      :is-open="isOpen"
      :loading="loading"
      :disabled="disabled"
      :clearable="clearable"
      :multiple="multiple"
      :placeholder="placeholder"
      :selected-labels="selectedLabels"
      :dropdown-id="dropdownId"
      @toggle="toggleDropdown"
      @clear="clearSelection"
    />

    <transition
      :enter-active-class="transitionClasses.enter"
      :enter-from-class="transitionClasses.enterFrom"
      :enter-to-class="transitionClasses.enterTo"
      :leave-active-class="transitionClasses.leave"
      :leave-from-class="transitionClasses.leaveFrom"
      :leave-to-class="transitionClasses.leaveTo"
    >
      <MultiSelectDropdown
        v-if="isOpen"
        ref="dropdownRef"
        :dropdown-id="dropdownId"
        :options="options"
        :multiple="multiple"
        :enable-search="enableSearch"
        :no-options-text="noOptionsText"
        :no-results-text="noResultsText"
        :active-index="activeIndex"
        :position="dropdownPosition"
        @search="handleSearch"
        @select="selectOption"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { onClickOutside, useVModel } from '@vueuse/core';
import type { Option, Direction, Position } from './types';
import MultiSelectTrigger from './MultiSelectTrigger.vue';
import MultiSelectDropdown from './MultiSelectDropdown.vue';

const props = withDefaults(
  defineProps<{
    modelValue: (string | number)[] | string | number | null;
    options: Option[];
    multiple?: boolean;
    enableSearch?: boolean;
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    noOptionsText?: string;
    noResultsText?: string;
    clearable?: boolean;
    direction?: Direction;
  }>(),
  {
    multiple: false,
    enableSearch: true,
    placeholder: 'Select option',
    disabled: false,
    loading: false,
    noOptionsText: 'No options available',
    noResultsText: 'No results found',
    clearable: true,
    direction: 'down',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[] | string | number | null];
  search: [query: string];
  open: [value: boolean];
}>();

const containerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<InstanceType<typeof MultiSelectDropdown> | null>(null);
const isOpen = ref(false);
const activeIndex = ref(-1);
const dropdownId = `multiselect-${Math.random().toString(36).slice(2)}`;
const selectedValue = useVModel(props, 'modelValue', emit);

const selectedLabels = computed(() => {
  if (!selectedValue.value) return [];
  const values = Array.isArray(selectedValue.value)
    ? selectedValue.value
    : [selectedValue.value];

  return props.options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label);
});

const dropdownPosition = ref<Position>({});

const updateDropdownPosition = () => {
  if (!containerRef.value || !isOpen.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const minSpace = 250; // minimum space needed for dropdown

  if (
    props.direction === 'up' ||
    (props.direction === 'down' &&
      spaceBelow < minSpace &&
      spaceAbove > spaceBelow)
  ) {
    dropdownPosition.value = {
      bottom: '100%',
    };
  } else {
    dropdownPosition.value = {
      top: '100%',
    };
  }
};

const transitionClasses = computed(() => {
  const isUpward = 'bottom' in dropdownPosition.value;
  return {
    enter: 'transition ease-out duration-200',
    enterFrom: `opacity-0 ${isUpward ? 'translate-y-1' : '-translate-y-1'}`,
    enterTo: 'opacity-100 translate-y-0',
    leave: 'transition ease-in duration-150',
    leaveFrom: 'opacity-100 translate-y-0',
    leaveTo: `opacity-0 ${isUpward ? 'translate-y-1' : '-translate-y-1'}`,
  };
});

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  emit('open', isOpen.value);

  if (isOpen.value) {
    nextTick(() => {
      updateDropdownPosition();
      if (props.enableSearch) {
        dropdownRef.value?.searchInput?.focus();
      }
    });
  }
};

const selectOption = (option: Option) => {
  if (option.disabled) return;

  if (props.multiple) {
    const current = Array.isArray(selectedValue.value)
      ? selectedValue.value
      : [];
    const index = current.indexOf(option.value);

    if (index === -1) {
      selectedValue.value = [...current, option.value];
    } else {
      selectedValue.value = current.filter((v) => v !== option.value);
    }
  } else {
    selectedValue.value = option.value;
    isOpen.value = false;
  }

  if (!props.multiple) {
    dropdownRef.value?.clearSearch();
  }
};

const clearSelection = () => {
  selectedValue.value = props.multiple ? [] : null;
  dropdownRef.value?.clearSearch();
};

const handleSearch = (query: string) => {
  emit('search', query);
  activeIndex.value = -1;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    }
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      activeIndex.value = Math.min(
        activeIndex.value + 1,
        props.options.length - 1
      );
      break;
    case 'ArrowUp':
      e.preventDefault();
      activeIndex.value = Math.max(activeIndex.value - 1, -1);
      break;
    case 'Enter':
      e.preventDefault();
      if (activeIndex.value >= 0) {
        selectOption(props.options[activeIndex.value]);
      }
      break;
    case 'Escape':
      isOpen.value = false;
      break;
  }
};

onClickOutside(containerRef, () => {
  isOpen.value = false;
});

const handleResize = () => {
  updateDropdownPosition();
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleResize);
});

watch(isOpen, () => {
  if (isOpen.value) {
    updateDropdownPosition();
  }
});
</script>
