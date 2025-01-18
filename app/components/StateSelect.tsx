import { useTranslation } from '../hooks/useTranslation';
import { useLocale } from '../contexts/LocaleContext';

export function StateSelect({ value, onChange }: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  const { locale } = useLocale();
  const { translate } = useTranslation(locale);

  return (
    <div className="form-group">
      <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-1">
        {translate('form.select_state', { required: translate('common.required') })}
      </label>
      <select
        id="state-select"
        name="state"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full p-2 border rounded focus:border-blue-500"
        aria-required="true"
      >
        <option value="">{translate('form.select_state')}</option>
        {/* ... options ... */}
      </select>
    </div>
  );
} 