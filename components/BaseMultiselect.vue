<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { onClickOutside, useVModel } from '@vueuse/core'

export interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue: (string | number)[] | string | number | null
  options: Option[]
  multiple?: boolean
  searchable?: boolean
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  noOptionsText?: string
  noResultsText?: string
  clearable?: boolean
  maxHeight?: string
}>(), {
  multiple: false,
  searchable: true,
  placeholder: 'Select option',
  disabled: false,
  loading: false,
  noOptionsText: 'No options available',
  noResultsText: 'No results found',
  clearable: true,
  maxHeight: '300px'
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[] | string | number | null]
  'search': [query: string]
  'open': [value: boolean]
}>()

const containerRef = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const search = ref('')
const activeIndex = ref(-1)

const selectedValue = useVModel(props, 'modelValue', emit)

const filteredOptions = computed(() => {
  return props.options.filter(option => 
    option.label.toLowerCase().includes(search.value.toLowerCase())
  )
})

const selectedLabels = computed(() => {
  if (!selectedValue.value) return []
  const values = Array.isArray(selectedValue.value) 
    ? selectedValue.value 
    : [selectedValue.value]
  
  return props.options
    .filter(option => values.includes(option.value))
    .map(option => option.label)
})

const displayValue = computed(() => {
  if (!selectedValue.value) return ''
  return Array.isArray(selectedValue.value)
    ? selectedLabels.value.join(', ')
    : selectedLabels.value[0] || ''
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  emit('open', isOpen.value)
  
  if (isOpen.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const selectOption = (option: Option) => {
  if (option.disabled) return
  
  if (props.multiple) {
    const current = Array.isArray(selectedValue.value) ? selectedValue.value : []
    const index = current.indexOf(option.value)
    
    if (index === -1) {
      selectedValue.value = [...current, option.value]
    } else {
      selectedValue.value = current.filter(v => v !== option.value)
    }
  } else {
    selectedValue.value = option.value
    isOpen.value = false
  }
  
  if (!props.multiple) {
    search.value = ''
  }
}

const isSelected = (option: Option) => {
  if (!selectedValue.value) return false
  return Array.isArray(selectedValue.value)
    ? selectedValue.value.includes(option.value)
    : selectedValue.value === option.value
}

const clearSelection = () => {
  selectedValue.value = props.multiple ? [] : null
  search.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleDropdown()
    }
    return
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      activeIndex.value = Math.min(activeIndex.value + 1, filteredOptions.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, -1)
      break
    case 'Enter':
      e.preventDefault()
      if (activeIndex.value >= 0) {
        selectOption(filteredOptions.value[activeIndex.value])
      }
      break
    case 'Escape':
      isOpen.value = false
      break
  }
}

watch(search, (value) => {
  emit('search', value)
  activeIndex.value = -1
})

onClickOutside(containerRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div 
    ref="containerRef"
    class="relative"
    @keydown="handleKeydown"
  >
    <button
      type="button"
      class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
      :class="{
        'border-gray-300': !isOpen,
        'border-indigo-500 ring-2 ring-indigo-500': isOpen
      }"
      :disabled="disabled"
      @click="toggleDropdown"
    >
      <span v-if="loading" class="block truncate text-gray-500">
        Loading...
      </span>
      <span v-else-if="selectedValue && displayValue" class="block truncate">
        {{ displayValue }}
      </span>
      <span v-else class="block truncate text-gray-500">
        {{ placeholder }}
      </span>

      <span class="absolute inset-y-0 right-0 flex items-center pr-2">
        <button 
          v-if="clearable && selectedValue" 
          type="button"
          class="text-gray-400 hover:text-gray-500"
          @click.stop="clearSelection"
        >
          <span class="sr-only">Clear selection</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
        <svg v-else class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-show="isOpen"
        class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
      >
        <div class="p-2">
          <input
            v-if="searchable"
            ref="searchInput"
            v-model="search"
            type="search"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            :placeholder="'Search...'"
          />
        </div>

        <ul
          class="max-h-[v-bind(maxHeight)] overflow-auto py-1"
          role="listbox"
        >
          <template v-if="filteredOptions.length">
            <li
              v-for="(option, index) in filteredOptions"
              :key="option.value"
              class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
              :class="{
                'bg-indigo-600 text-white': activeIndex === index,
                'opacity-50 cursor-not-allowed': option.disabled
              }"
              @click="selectOption(option)"
            >
              <div class="flex items-center">
                <span
                  class="block truncate"
                  :class="{ 'font-semibold': isSelected(option) }"
                >
                  {{ option.label }}
                </span>
              </div>

              <span
                v-if="isSelected(option)"
                class="absolute inset-y-0 right-0 flex items-center pr-4"
                :class="{ 'text-white': activeIndex === index }"
              >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </li>
          </template>
          <li
            v-else
            class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500"
          >
            {{ search ? noResultsText : noOptionsText }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>