import { remove } from 'lodash';

export default {
  validate: {
    parse(validator) {
      return {
        validate: validator.toString(),
      };
    },
  },
  choices: {
    parse(list) {
      remove(list, function (item: any) {
        return item.type && item.type === 'separator';
      });

      const newList = list.map((item) => {
        if (typeof item === 'string' || typeof item === 'number') {
          return {
            name: item,
            value: item,
          };
        }

        const newItem: Record<string, any> = {
          name: typeof item.name === 'undefined' ? item.value : item.name,
          value: typeof item.value === 'undefined' ? item.name : item.value,
        };

        if (item.disabled) {
          newItem.disabled = true;
        }

        return newItem;
      });

      return {
        choices: newList,
      };
    },
  },
  filter: {
    disabled: true,
  },
  transformer: {
    disabled: true,
  },
  when: {
    disabled: true,
  },
  mask: {
    disabled: true,
  },
};
