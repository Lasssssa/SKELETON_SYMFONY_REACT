import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { Fieldset } from '@codegouvfr/react-dsfr/Fieldset';

type Option<T> = T | string | number;

interface DsfrMultiSelectProps<T extends object | string | number> {
  id?: string;
  label?: string;
  labelVisible?: boolean;
  labelClass?: string;
  hint?: string;
  legend?: string;
  buttonLabel?: string;
  selectAll?: boolean;
  selectAllLabel?: [string, string];
  options: Option<T>[];
  modelValue?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  search?: boolean;
  idKey?: keyof T;
  labelKey?: keyof T;
  filteringKeys?: (keyof T)[];
  maxOverflowHeight?: string;
  errorMessage?: string;
  successMessage?: string;
}

export function DsfrMultiSelect<T extends object | string | number>({
  id: propId,
  label = '',
  labelVisible = true,
  labelClass = '',
  hint = '',
  legend = '',
  buttonLabel,
  selectAll = false,
  selectAllLabel = ['Tout sélectionner', 'Tout désélectionner'],
  options,
  modelValue = [],
  onChange,
  search = false,
  idKey = 'id' as keyof T,
  labelKey = 'label' as keyof T,
  filteringKeys = ['label'] as (keyof T)[],
  maxOverflowHeight = '400px',
  errorMessage = '',
  successMessage = '',
}: DsfrMultiSelectProps<T>) {
  const id = useMemo(() => propId || `multiselect-${Math.random().toString(36).slice(2)}`, [propId]);

  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [model, setModel] = useState<(string | number)[]>(modelValue);
  const [searchInput, setSearchInput] = useState('');

  const hostRef = useRef<HTMLButtonElement>(null);
  const collapseRef = useRef<HTMLDivElement>(null);
  const hostWidthRef = useRef(0);

  const message = errorMessage || successMessage;
  const messageType = errorMessage ? 'error' : successMessage ? 'valid' : '';

  // Gestion du clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!hostRef.current?.contains(event.target as Node) &&
          !collapseRef.current?.contains(event.target as Node)) {
        close();
      }
    };
    const handleKeyDownEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    if (visible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDownEscape);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDownEscape);
    };
  }, [visible]);

  const getValueOrId = (option: Option<T>): string | number => {
    if (typeof option === 'object' && option !== null && idKey in option) {
      const value = (option as T)[idKey];
      if (typeof value === 'string' || typeof value === 'number') return value;
      throw new Error(`idKey value must be string or number`);
    }
    if (typeof option === 'string' || typeof option === 'number') return option;
    throw new Error('Option must be string, number, or object with idKey');
  };

  const generateId = (option: Option<T>) => `${id}-${getValueOrId(option)}-checkbox`;

  const filteredOptions = useMemo(() => {
    return options.filter(option => {
      const str = typeof option === 'object' && option !== null
        ? filteringKeys.some(k => String((option as T)[k]).toLowerCase().includes(searchInput.toLowerCase()))
        : String(option).toLowerCase().includes(searchInput.toLowerCase());
      return str;
    });
  }, [options, searchInput, filteringKeys]);

  const isAllSelected = useMemo(() => {
    return filteredOptions.length > 0 &&
           filteredOptions.every(o => model.includes(getValueOrId(o)));
  }, [filteredOptions, model]);

  const handleSelectAllClick = () => {
    const newModel = new Set(model);
    if (isAllSelected) {
      filteredOptions.forEach(o => newModel.delete(getValueOrId(o)));
    } else {
      filteredOptions.forEach(o => newModel.add(getValueOrId(o)));
    }
    const arr = Array.from(newModel);
    setModel(arr);
    onChange?.(arr);
  };

  const toggle = () => {
    if (visible) close();
    else open();
  };

  const open = () => {
    setExpanded(true);
    setVisible(true);
    if (hostRef.current) hostWidthRef.current = hostRef.current.offsetWidth;
  };

  const close = () => {
    setExpanded(false);
    setTimeout(() => setVisible(false), 300);
  };

  const defaultButtonLabel = model.length === 0
    ? 'Sélectionner une option'
    : `${model.length} option${model.length > 1 ? 's' : ''} sélectionnée${model.length > 1 ? 's' : ''}`;

  return (
    <div className={`fr-select-group ${message ? `fr-select-group--${messageType}` : ''}`}>
      <label htmlFor={id} className={`fr-label ${labelVisible ? '' : 'invisible'} ${labelClass}`}>
        {label}
        {hint && <span className="fr-hint-text">{hint}</span>}
      </label>

      <Button
        ref={hostRef}
        id={id}
        secondary
        type="button"
        className={`fr-select fr-multiselect ${expanded ? 'fr-multiselect--is-open' : ''} ${message ? `fr-select--${messageType}` : ''}`}
        aria-expanded={expanded}
        aria-controls={`${id}-collapse`}
        onClick={toggle}
      >
        {buttonLabel || defaultButtonLabel}
      </Button>

      {visible && (
        <div
          id={`${id}-collapse`}
          ref={collapseRef}
          style={{ '--width-host': `${hostWidthRef.current}px` } as React.CSSProperties}
          className={`fr-multiselect__collapse fr-collapse ${expanded ? 'fr-collapse--expanded' : ''}`}
        >
          <p id={`${id}-text-hint`} className="fr-sr-only">
            Utilisez la tabulation (ou les touches flèches) pour naviguer dans la liste des suggestions
          </p>

          {selectAll && (
            <ul className="fr-btns-group">
              <li>
                <Button
                  type="button"
                  secondary
                  size="sm"
                  disabled={filteredOptions.length === 0}
                  onClick={handleSelectAllClick}
                >
                  <span
                    className={`fr-multiselect__search__icon ${isAllSelected ? 'fr-icon-close-circle-line' : 'fr-icon-check-line'}`}
                  />
                  {selectAllLabel[isAllSelected ? 1 : 0]}
                </Button>
              </li>
            </ul>
          )}

          {search && (
            <div className="fr-input-group">
              <div className="fr-input-wrap fr-icon-search-line">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Rechercher"
                  aria-describedby={`${id}-text-hint`}
                  aria-controls={`${id}-checkboxes`}
                  aria-live="polite"
                  type="text"
                />
              </div>
            </div>
          )}

          <Fieldset
            id={`${id}-checkboxes`}
            legend={legend}
            style={{ '--maxOverflowHeight': maxOverflowHeight } as React.CSSProperties}
          >
            {filteredOptions.map(option => {
              const optionId = generateId(option);
              return (
                <div key={optionId} className="fr-fieldset__element">
                  <div className="fr-checkbox-group fr-checkbox-group--sm">
                    <Checkbox
                      id={optionId}
                      value={getValueOrId(option)}
                      checked={model.includes(getValueOrId(option))}
                      onChange={(checked) => {
                        const newModel = checked
                          ? [...model, getValueOrId(option)]
                          : model.filter(v => v !== getValueOrId(option));
                        setModel(newModel);
                        onChange?.(newModel);
                      }}
                    >
                      {typeof option === 'object' ? (option as T)[labelKey] : option}
                    </Checkbox>
                  </div>
                </div>
              );
            })}
            {filteredOptions.length === 0 && <div>Pas de résultat</div>}
          </Fieldset>
        </div>
      )}

      {message && (
        <p id={`select-${messageType}-desc-${messageType}`} className={`fr-${messageType}-text`}>
          {message}
        </p>
      )}
    </div>
  );
}
