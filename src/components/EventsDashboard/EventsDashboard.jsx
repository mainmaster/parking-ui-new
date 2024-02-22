import styles from './eventsDashboard.module.css'
import {useGlobalSettingsQuery, useParkingInfoQuery} from "../../api/settings/settings";
import {ProgressBar} from "react-bootstrap";
import {Pie} from "@ant-design/plots";


export const EventsDashboard = () =>{
    const {data: parkingInfo} = useParkingInfoQuery()
    const {data: parkingSettings} = useGlobalSettingsQuery()

    let data = [
        {type: "Свободно мест", value: parkingInfo?.carsOnParking.freePlaces},
        {type: "Количество мест занятых разовыми посетителями", value: parkingInfo.carsOnParking['1006']},
        {type: "Количество мест занятых авто из автопарка", value: parkingInfo.carsOnParking['1008']},
        {type: "Количество мест занятых авто по заявкам", value: parkingInfo.carsOnParking['1028']},
        {type: "Количество мест занятых авто по абонементу", value: parkingInfo.carsOnParking['1034']},
    ]

    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        legend: {
            layout: 'horizontal',
            maxItemWidth: 600,
            position: 'top',
        },
        position: 'left',
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                content: `Мест\n${parkingInfo?.carsOnParking.totalPlaces}`,
            },
        },
    }




    return(
        <div className={styles.wrappDashboard}>
            {parkingSettings?.print_count_free_places
                ?<>
                    <div style={{maxWidth: 500}}>
                        <p>Места на парковке</p>
                        <Pie {...config}/>
                        {/*<ProgressBar*/}
                        {/*    label={`${parkingSettings?.total_places_for_cars - parkingSettings?.count_free_places}`}*/}
                        {/*    now={parkingSettings?.total_places_for_cars - parkingSettings?.count_free_places}*/}
                        {/*    max={parkingSettings?.total_places_for_cars}/>*/}
                    </div>
                </>: null
            }
        </div>
    )
}