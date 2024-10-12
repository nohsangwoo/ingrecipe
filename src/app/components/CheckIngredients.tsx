

interface CheckIngredientsProps {
    isLoading: boolean
    parsedData: string[]
}

const CheckIngredients = ({ isLoading, parsedData }: CheckIngredientsProps) => {

    if (isLoading) {
        <div>
            로딩중
        </div>
    }

    if (!parsedData || parsedData?.length === 0) {
        return (
            <div>
                데이터 없음
            </div>
        )

    }
    return (
        <div>
            {
                parsedData.map((data, index) => {
                    return (
                        <div key={index}>
                            {data}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default CheckIngredients