import axios from 'axios'

export const useAnswerRetrospective = () => {
  const onSubmitAnswer = async (selectedRowIds: string[]) => {
    console.log(selectedRowIds)
    const response = await axios.post('/api/workrules/retrospective', {
      selectedRowIds,
    })

    return response
  }

  return {
    onSubmitAnswer,
  }
}