import { View, Text, TextInput } from 'react-native'
import * as styles from '@/constants/styles'
import { Control, Controller } from 'react-hook-form'

import { RESPONSE_MAX_LENGTH } from './add-response'

interface TextResponseProps {
  control: Control
}

const TextResponse = ({ control }: TextResponseProps) => {
  return (
    <Controller
      control={control}
      name="text"
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter response here"
            multiline
            className={styles.inputField}
          />
          <Text className={`${styles.remainingCharacters} 
            ${value.length >= RESPONSE_MAX_LENGTH - 20 && styles.approachingCharacterLimit}`}>
            {RESPONSE_MAX_LENGTH - value.length}
          </Text>
        </>
      )}
    />
  )
}

export default TextResponse