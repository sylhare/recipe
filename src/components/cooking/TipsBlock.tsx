import { useTranslation } from 'react-i18next'

interface TipsBlockProps {
  tips: string[] | undefined
}

export function TipsBlock({ tips }: TipsBlockProps) {
  const { t } = useTranslation()
  if (!tips || tips.length === 0) return null

  return (
    <div className="instruction-tips">
      <h4 className="instruction-tips__title">
        <span className="instruction-tips__icon">💡</span>
        {t('cooking.tips')}
      </h4>
      <ul className="instruction-tips__list">
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  )
}
