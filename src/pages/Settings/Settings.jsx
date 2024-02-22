import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputMask from 'react-input-mask'
import styles from './settings.module.css'
import { Accordion, Spinner, Tab, Tabs } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { setPersonalInfoPolicy } from 'api/settings/personalInfoPolicy'
import { setPaymentsPageImage } from 'api/settings/paymentsPageImage'
import { setReturnPolicy } from 'api/settings/returnPolicy'
import {
  useGlobalSettingsQuery,
  useParkingInfoQuery,
  usePutParkingInfoMutation,
} from 'api/settings/settings'
import { useEditGlobalSettingsMutation } from 'api/settings/settings'

const Settings = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [personalInfoFile, setPersonalInfoFile] = useState()
  const [returnPolicyFile, setReturnPolicyFile] = useState()
  const [paymentsPageImageFile, setPaymentsPageImageFile] = useState()
  const { data, isLoading: loadingGlobal } = useGlobalSettingsQuery()
  const { data: parkingInfo } = useParkingInfoQuery()
  const [editParkingInfoQuery] = usePutParkingInfoMutation()
  const [editGlobal] = useEditGlobalSettingsMutation()
  const [editParkingInfo, setEditParkingInfo] = useState(parkingInfo)
  const [notificationsSound, setNotificationsSound] = useState(
    localStorage.getItem('notificationsSound')
  )
  const [globalSettings, setGlobalSettings] = useState({
    company_info: '',
    company_name: '',
    count_free_places: 0,
    print_count_free_places: false,
    operator_phone_number: '',
    yookassa_api_key: '',
    yookassa_shop_id: '',
    week_subscription_price: '',
    month_subscription_price: '',
    quarter_subscription_price: '',
    year_subscription_price: '',
    support_subscribe: false,
    mins_to_leave_parking: 0,
    entry_on_request_only: false,
    release_all_sessions_not_found_without_payment: false,
    release_all_sessions_not_found_with_payment_amount: 0,
    let_the_car_in_with_opened_session: false,
    save_events_with_not_recognized_plate: false,
    seconds_before_close_laurent: 0,
    seconds_between_laurent_checks: 0,
    terminal_payment_ttl: 60,
  })

  useEffect(() => {
    if (data) {
      setGlobalSettings(data)
      setEditParkingInfo(parkingInfo)
    }
  }, [data, parkingInfo])

  const handleGlobalSettings = (e) => {
    if (e.target.type === 'checkbox') {
      setGlobalSettings({
        ...globalSettings,
        [e.target.name]: Boolean(e.target.checked),
      })
    } else {
      setGlobalSettings({ ...globalSettings, [e.target.name]: e.target.value })
    }
  }

  const handleGlobalIn = (e) => {
    setGlobalSettings({
      ...globalSettings,
      led_board_message_texts: {
        in: {
          ...globalSettings.led_board_message_texts.in,
          [e.target.name]: e.target.value,
        },
        out: {
          ...globalSettings.led_board_message_texts.out,
        },
      },
    })
  }

  const handleGlobalOut = (e) => {
    setGlobalSettings({
      ...globalSettings,
      led_board_message_texts: {
        in: {
          ...globalSettings.led_board_message_texts.in,
        },
        out: {
          ...globalSettings.led_board_message_texts.out,
          [e.target.name]: e.target.value,
        },
      },
    })
  }

  const handlePersonalInfoSettings = (e) => {
    setPersonalInfoFile(e.target.files[0])
  }
  const handleReturnPolicy = (e) => {
    setReturnPolicyFile(e.target.files[0])
  }
  const handlePaymentsPageImage = (e) => {
    setPaymentsPageImageFile(e.target.files[0])
  }
  const handleParkingInfo = (e) => {
    setEditParkingInfo({ ...editParkingInfo, [e.target.name]: e.target.value })
  }

  const editPersonalInfoPolicySubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let formData = new FormData()
    formData.append('file', personalInfoFile)
    setPersonalInfoPolicy(formData).then(() =>
      enqueueSnackbar('Файл успешно загружен', { variant: 'success' })
    )
  }

  const editParkingInfoSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    let result = await editParkingInfoQuery(editParkingInfo)
    if (result.error) {
      enqueueSnackbar(result.error, { variant: 'error' })
    } else {
      enqueueSnackbar('Данные успешно измененны', { variant: 'success' })
    }
  }

  const editReturnPolicySubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let formData = new FormData()
    formData.append('file', returnPolicyFile)
    setReturnPolicy(formData).then(() =>
      enqueueSnackbar('Файл успешно загружен', { variant: 'success' })
    )
  }

  const editPaymentsPageImageSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let formData = new FormData()
    formData.append('file', paymentsPageImageFile)
    setPaymentsPageImage(formData).then(() =>
      enqueueSnackbar('Файл успешно загружен', { variant: 'success' })
    )
  }

  const editGlobalSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    localStorage.setItem('notificationsSound', notificationsSound)
    let result = await editGlobal(globalSettings)
    if (result.error) {
      enqueueSnackbar(result.error, { variant: 'error' })
    } else {
      enqueueSnackbar('Данные успешно измененны', { variant: 'success' })
    }
  }

  const editGlobalOperatorSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    localStorage.setItem('notificationsSound', notificationsSound)

    enqueueSnackbar('Данные успешно измененны', { variant: 'success' })
  }

  return (
    <>
      {parkingInfo.userType === 'operator' ? (
        <div className={styles.tabWrapper}>
          <Form onSubmit={editGlobalOperatorSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Звук уведомлений</Form.Label>
              <Form.Check
                size={100}
                name="notificationsSound"
                onChange={(e) => {
                  setNotificationsSound(e.target.checked.toString())
                }}
                checked={notificationsSound === 'true'}
                type="switch"
              />
            </Form.Group>
            <Button type="submit">Изменить</Button>
          </Form>
        </div>
      ) : (
        <Tabs fill transition={false}>
          <Tab eventKey="global" title="Основное">
            <div className={styles.tabWrapper}>
              {loadingGlobal ? (
                <div>
                  <Spinner />
                </div>
              ) : (
                <Form className={styles.formPanels} onSubmit={editGlobalSubmit}>
                  <Accordion>
                    <Accordion.Header>
                      <h3>
                        <strong>Общее</strong>
                      </h3>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Имя компании</Form.Label>
                        <Form.Control
                          name="company_name"
                          onChange={handleGlobalSettings}
                          value={globalSettings.company_name}
                          type="name"
                          placeholder="Имя"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.company_info"
                      >
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                          name="company_info"
                          onChange={handleGlobalSettings}
                          value={globalSettings.company_info}
                          as="textarea"
                          rows={3}
                          placeholder="Информации о компании"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Номер телефона оператора</Form.Label>
                        <InputMask
                          mask="+7 (999) 999-99-99"
                          onChange={handleGlobalSettings}
                          value={globalSettings.operator_phone_number}
                          defaultValue={globalSettings.operator_phone_number}
                        >
                          {(inputProps) => (
                            <Form.Control
                              name="operator_phone_number"
                              type="tel"
                            />
                          )}
                        </InputMask>
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion>
                  <Accordion>
                    <Accordion.Header>
                      <h3>
                        <strong>Места на парковке</strong>
                      </h3>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Количество свободных мест</Form.Label>
                        <Form.Control
                          name="count_free_places"
                          onChange={handleGlobalSettings}
                          value={globalSettings.count_free_places}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Общее количество мест на парковке
                        </Form.Label>
                        <Form.Control
                          name="total_places_for_cars"
                          onChange={handleGlobalSettings}
                          value={globalSettings.total_places_for_cars}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Вывод количества свободных мест</Form.Label>
                        <Form.Check
                          size={100}
                          name="print_count_free_places"
                          onChange={handleGlobalSettings}
                          checked={Boolean(
                            globalSettings.print_count_free_places
                          )}
                          type="switch"
                        />
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion>
                  <Accordion>
                    <Accordion.Header>
                      <h3>
                        <strong>Платёжные системы</strong>
                      </h3>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Yookassa shop key</Form.Label>
                        <Form.Control
                          name="yookassa_api_key"
                          onChange={handleGlobalSettings}
                          value={globalSettings.yookassa_api_key}
                          type="text"
                          placeholder=""
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Yookassa shop id</Form.Label>
                        <Form.Control
                          name="yookassa_shop_id"
                          onChange={handleGlobalSettings}
                          value={globalSettings.yookassa_shop_id}
                          type="text"
                          placeholder=""
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Время жизни сессии оплаты терминала
                        </Form.Label>
                        <Form.Control
                          name="terminal_payment_ttl"
                          onChange={handleGlobalSettings}
                          value={globalSettings.terminal_payment_ttl}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Пускать авто бесплатно если система оплаты не доступна{' '}
                        </Form.Label>
                        <Form.Check
                          size={100}
                          name="if_payment_is_impossible_passage_cars_for_free"
                          onChange={handleGlobalSettings}
                          checked={Boolean(
                            globalSettings.if_payment_is_impossible_passage_cars_for_free
                          )}
                          type="switch"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Время показа QR кода на терминале
                        </Form.Label>
                        <Form.Control
                          name="secs_to_show_terminal_qr_code"
                          onChange={handleGlobalSettings}
                          value={globalSettings.secs_to_show_terminal_qr_code}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Заголовок для онлайн-оплаты</Form.Label>
                        <Form.Control
                          name="payment_page_header"
                          onChange={handleGlobalSettings}
                          value={globalSettings.payment_page_header}
                          type="text"
                          placeholder=""
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>
                          ID продукта (Vendotek)
                          </Form.Label>
                          <Form.Control
                            name="vendotek_terminal_prod_id"
                            onChange={handleGlobalSettings}
                            value={globalSettings.vendotek_terminal_prod_id}
                            type="text_number"
                            placeholder="Кол-во"
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>
                          Имя продукта  (Vendotek)
                          </Form.Label>
                          <Form.Control
                            name="vendotek_terminal_prod_name"
                            onChange={handleGlobalSettings}
                            value={globalSettings.vendotek_terminal_prod_name}
                            type="text_number"
                            placeholder="Кол-во"
                          />
                        </Form.Group>
                        <Form.Label>
                          Тип возврата оплат через терминал
                        </Form.Label>
                        <Form.Select
                          onChange={handleGlobalSettings}
                          value={globalSettings.terminal_payment_refund_type}
                          name="terminal_payment_refund_type"
                        >
                          <option value="1">Бесконтактный</option>
                          <option value="0">Контактный</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Система налогообложения (Юкасса)</Form.Label>
                        <Form.Select
                          onChange={handleGlobalSettings}
                          value={globalSettings.yookassa_tax_system_code}
                          name="yookassa_tax_system_code"
                        >
                          <option value="1">Общая, ОСН</option>
                          <option value="2">Упрощенная доход,УСН доход</option>
                          <option value="3">Упрощенная доход минус расход, УСН доход - расход</option>
                          <option value="4">Единый налог на вмененный доход, ЕНВД</option>
                          <option value="5">Единый сельскохозяйственный налог, ЕСН</option>
                          <option value="6">Патентная система налогообложения, Патент</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Тип НДС (Юкасса)</Form.Label>
                        <Form.Select
                          onChange={handleGlobalSettings}
                          value={globalSettings.yookassa_vat_code}
                          name="yookassa_vat_code"
                        >
                          <option value="1">Без НДС</option>
                          <option value="2">НДС по ставке 0%</option>
                          <option value="3">НДС по ставке 10%</option>
                          <option value="4">НДС чека по ставке 20%</option>
                          <option value="5">НДС чека по расчетной ставке 10/110</option>
                          <option value="6">НДС чека по расчетной ставке 20/120</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Система налогообложения (AQSI)</Form.Label>
                        <Form.Select
                          onChange={handleGlobalSettings}
                          value={globalSettings.aqsi_tax_system_code}
                          name="aqsi_tax_system_code"
                        >
                          <option value="1">Общая, ОСН</option>
                          <option value="2">Упрощенная доход,УСН доход</option>
                          <option value="4">Упрощенная доход минус расход, УСН доход - расход</option>
                          <option value="8">Единый налог на вмененный доход, ЕНВД</option>
                          <option value="16">Единый сельскохозяйственный налог, ЕСН</option>
                          <option value="32">Патентная система налогообложения, Патент</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Тип НДС (AQSI)</Form.Label>
                        <Form.Select
                          onChange={handleGlobalSettings}
                          value={globalSettings.aqsi_vat_code}
                          name="aqsi_vat_code"
                        >
                          <option value="1">20%</option>
                          <option value="2">10%</option>
                          <option value="3">Ставка расч. 20/120</option>
                          <option value="4">Ставка расч. 10/110</option>
                          <option value="5">0%</option>
                          <option value="6">Без НДС</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>
                          Почта для невостребованных чеков
                          </Form.Label>
                          <Form.Control
                            name="email_for_unclaimed_checks"
                            onChange={handleGlobalSettings}
                            value={globalSettings.email_for_unclaimed_checks}
                            type="text_number"
                            placeholder="Кол-во"
                          />
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                        Требовать  email для онлайн-оплаты
                        </Form.Label>
                        <Form.Check
                          size={100}
                          name="email_for_online_payment"
                          onChange={handleGlobalSettings}
                          checked={Boolean(
                            globalSettings.email_for_online_payment
                          )}
                          type="switch"
                        />
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion>
                  <Accordion>
                    <Accordion.Header>
                      <h3>
                        <strong>Абонементы</strong>
                      </h3>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Стоимость абонемента на неделю</Form.Label>
                        <Form.Control
                          name="week_subscription_price"
                          onChange={handleGlobalSettings}
                          value={globalSettings.week_subscription_price}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Стоимость абонемента на месяц</Form.Label>
                        <Form.Control
                          name="month_subscription_price"
                          onChange={handleGlobalSettings}
                          value={globalSettings.month_subscription_price}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Стоимость абонемента на квартал</Form.Label>
                        <Form.Control
                          name="quarter_subscription_price"
                          onChange={handleGlobalSettings}
                          value={globalSettings.quarter_subscription_price}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Стоимость абонемента на год</Form.Label>
                        <Form.Control
                          name="year_subscription_price"
                          onChange={handleGlobalSettings}
                          value={globalSettings.year_subscription_price}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Возможность покупки абонемента</Form.Label>
                        <Form.Check
                          size={100}
                          name="support_subscribe"
                          onChange={handleGlobalSettings}
                          checked={globalSettings.support_subscribe}
                          type="switch"
                        />
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion>
                  <Accordion>
                    <Accordion.Header>
                      <h3>
                        <strong>Облачное распознавание</strong>
                      </h3>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Использовать распознование от Vizor VL
                        </Form.Label>
                        <Form.Check
                          size={100}
                          name="vision_labs_support"
                          onChange={handleGlobalSettings}
                          checked={globalSettings.vision_labs_support}
                          type="switch"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Адрес сервера Vizor VL</Form.Label>
                        <Form.Control
                          name="vision_labs_address"
                          onChange={handleGlobalSettings}
                          value={globalSettings.vision_labs_address}
                          type="text"
                          placeholder=""
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Бесплатный доступ для спец. авто
                        </Form.Label>
                        <Form.Check
                          size={100}
                          name="free_access_emergency"
                          onChange={handleGlobalSettings}
                          checked={globalSettings.free_access_emergency}
                          type="switch"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>car_score_vl_recognition</Form.Label>
                        <Form.Control
                          name="car_score_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={globalSettings.car_score_vl_recognition}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>plate_score_vl_recognition</Form.Label>
                        <Form.Control
                          name="plate_score_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={globalSettings.plate_score_vl_recognition}
                          type="text_number"
                          step="0.01"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          plate_symbols_score_vl_recognition
                        </Form.Label>
                        <Form.Control
                          name="plate_symbols_score_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={
                            globalSettings.plate_symbols_score_vl_recognition
                          }
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>regno_score_vl_recognition</Form.Label>
                        <Form.Control
                          name="regno_score_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={globalSettings.regno_score_vl_recognition}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          emergency_car_score_vl_recognition
                        </Form.Label>
                        <Form.Control
                          name="emergency_car_score_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={
                            globalSettings.emergency_car_score_vl_recognition
                          }
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          car_brand_model_score_vl_recognition
                        </Form.Label>
                        <Form.Control
                          name="car_brand_model_score_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={
                            globalSettings.car_brand_model_score_vl_recognition
                          }
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>country_score_vl_recognition</Form.Label>
                        <Form.Control
                          name="country_score_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={globalSettings.country_score_vl_recognition}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Минимальная ширина машины на картинке
                        </Form.Label>
                        <Form.Control
                          name="min_width_car_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={globalSettings.min_width_car_vl_recognition}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Минимальная высота машины на картинке
                        </Form.Label>
                        <Form.Control
                          name="min_height_car_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={globalSettings.min_height_car_vl_recognition}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Минимальная ширина номера на картинке
                        </Form.Label>
                        <Form.Control
                          name="min_width_plate_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={globalSettings.min_width_plate_vl_recognition}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Минимальная высота номера на картинке
                        </Form.Label>
                        <Form.Control
                          name="min_height_plate_vl_recognition"
                          onChange={handleGlobalSettings}
                          value={globalSettings.min_height_plate_vl_recognition}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Количество событий с нераспознанным номером для
                          дополнительной логики
                        </Form.Label>
                        <Form.Control
                          name="number_of_bad_recognizations_for_additional_logic"
                          onChange={handleGlobalSettings}
                          value={
                            globalSettings.number_of_bad_recognizations_for_additional_logic
                          }
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Минимальное количество символов для подтверждения
                          совпадения номеров
                        </Form.Label>
                        <Form.Control
                          name="min_symbols_count_for_match"
                          onChange={handleGlobalSettings}
                          value={globalSettings.min_symbols_count_for_match}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Дополнительное подтверждение машин по марке и модели
                        </Form.Label>
                        <Form.Check
                          size={100}
                          name="additional_confirmation_car_by_brand_and_model"
                          onChange={handleGlobalSettings}
                          checked={
                            globalSettings.additional_confirmation_car_by_brand_and_model
                          }
                          type="switch"
                        />
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion>
                  <Accordion>
                    <Accordion.Header>
                      <h3>
                        <strong>Политика сессий</strong>
                      </h3>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Выпускать все машины без сессии без оплаты
                        </Form.Label>
                        <Form.Check
                          size={100}
                          name="release_all_sessions_not_found_without_payment"
                          onChange={handleGlobalSettings}
                          checked={
                            globalSettings.release_all_sessions_not_found_without_payment
                          }
                          type="switch"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Впускать все машины с открытой сессией
                        </Form.Label>
                        <Form.Check
                          size={100}
                          name="let_the_car_in_with_opened_session"
                          onChange={handleGlobalSettings}
                          checked={
                            globalSettings.let_the_car_in_with_opened_session
                          }
                          type="switch"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Выпускать все машины без сессии с оплатой штрафа
                        </Form.Label>
                        <Form.Control
                          name="release_all_sessions_not_found_with_payment_amount"
                          onChange={handleGlobalSettings}
                          value={
                            globalSettings.release_all_sessions_not_found_with_payment_amount
                          }
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Въезд только по заявкам</Form.Label>
                        <Form.Check
                          size={100}
                          name="entry_on_request_only"
                          onChange={handleGlobalSettings}
                          checked={globalSettings.entry_on_request_only}
                          type="switch"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Сохранять события с нераспознанным номером
                        </Form.Label>
                        <Form.Check
                          size={100}
                          name="save_events_with_not_recognized_plate"
                          onChange={handleGlobalSettings}
                          checked={
                            globalSettings.save_events_with_not_recognized_plate
                          }
                          type="switch"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Время на выезд из парковки, мин</Form.Label>
                        <Form.Control
                          name="mins_to_leave_parking"
                          onChange={handleGlobalSettings}
                          value={globalSettings.mins_to_leave_parking}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>
                          Время на закрытие ШГ если нет события подтверждения
                          проезда
                        </Form.Label>
                        <Form.Control
                          name="delay_before_checking_confirmation_events"
                          onChange={handleGlobalSettings}
                          value={
                            globalSettings.delay_before_checking_confirmation_events
                          }
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Время закрытия реле</Form.Label>
                        <Form.Control
                          name="relay_closing_time"
                          onChange={handleGlobalSettings}
                          value={globalSettings.relay_closing_time}
                          type="text_number"
                          placeholder="Кол-во"
                        />
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion>
                  <Accordion>
                    <Accordion.Header>
                      <h3>
                        <strong>Сообщения led-табло</strong>
                      </h3>
                    </Accordion.Header>
                    <Accordion.Body>
                      <h4>Въезд</h4>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {globalSettings?.led_board_message_texts?.in
                          ? Object.keys(
                              globalSettings.led_board_message_texts.in
                            ).map((key) => {
                              return (
                                <div style={{ marginLeft: '20px' }}>
                                  <p style={{ padding: 0, margin: 0 }}>
                                    {key}{' '}
                                  </p>
                                  <Form.Control
                                    name={key}
                                    onChange={handleGlobalIn}
                                    value={
                                      globalSettings.led_board_message_texts.in[
                                        key
                                      ]
                                    }
                                    type="text"
                                    placeholder=""
                                  />
                                </div>
                              )
                            })
                          : null}
                      </div>

                      <h4>Выезд</h4>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {globalSettings?.led_board_message_texts?.out
                          ? Object.keys(
                              globalSettings.led_board_message_texts.out
                            ).map((key) => {
                              return (
                                <div style={{ marginLeft: '20px' }}>
                                  <p style={{ padding: 0, margin: 0 }}>
                                    {key}{' '}
                                  </p>
                                  <Form.Control
                                    name={key}
                                    onChange={handleGlobalOut}
                                    value={
                                      globalSettings.led_board_message_texts
                                        .out[key]
                                    }
                                    type="text"
                                    placeholder=""
                                  />
                                </div>
                              )
                            })
                          : null}
                      </div>
                    </Accordion.Body>
                  </Accordion>

                  <div className="mt-3" style={{ padding: '20px' }}>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Звук уведомлений</Form.Label>
                      <Form.Check
                        size={100}
                        name="notificationsSound"
                        onChange={(e) => {
                          setNotificationsSound(e.target.checked.toString())
                        }}
                        checked={notificationsSound == 'true'}
                        type="switch"
                      />
                    </Form.Group>
                    <Button type="submit">Изменить</Button>
                  </div>
                </Form>
              )}
            </div>
          </Tab>
          <Tab
            eventKey="personalInfoPolicy"
            title="Политика обработки персональных данных"
          >
            <div className={styles.tabWrapper}>
              <Form onSubmit={editPersonalInfoPolicySubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                  <a
                    href={`api/settings/personalInfoPolicy/?parkingID=${parkingInfo.parkingID}`}
                  >
                    Политика обработки персональных данных
                    <br />
                  </a>
                  <Form.Label>Загрузите файл</Form.Label>
                  <Form.Control
                    onChange={handlePersonalInfoSettings}
                    type="file"
                  />
                </Form.Group>
                <Button type="submit">Загрузить</Button>
              </Form>
            </div>
          </Tab>
          <Tab eventKey="returnPolicy" title="Политика возврата и обмена">
            <div className={styles.tabWrapper}>
              <Form onSubmit={editReturnPolicySubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                  <a
                    href={`api/settings/returnPolicy/?parkingID=${parkingInfo.parkingID}`}
                  >
                    Политика возврата и обмена
                    <br />
                  </a>
                  <Form.Label>Загрузите файл</Form.Label>
                  <Form.Control onChange={handleReturnPolicy} type="file" />
                </Form.Group>
                <Button type="submit">Загрузить</Button>
              </Form>
            </div>
          </Tab>
          <Tab eventKey="paymentsPageImage" title="Страница оплаты">
            <div className={styles.tabWrapper}>
              <Form onSubmit={editPaymentsPageImageSubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                  <a
                    href={`api/settings/paymentsPageImage/?parkingID=${parkingInfo.parkingID}`}
                  >
                    Фото на странице оплаты
                    <br />
                  </a>
                  <Form.Label>Загрузите фото</Form.Label>
                  <Form.Control
                    onChange={handlePaymentsPageImage}
                    type="file"
                  />
                </Form.Group>
                <Button type="submit">Загрузить</Button>
              </Form>
            </div>
          </Tab>
          <Tab eventKey="infoParking" title="О парковке">
            <div className={styles.tabWrapper}>
              <Form onSubmit={editParkingInfoSubmit}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    name="name"
                    onChange={handleParkingInfo}
                    value={editParkingInfo?.name}
                    type="name"
                    placeholder=""
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Адрес</Form.Label>
                  <Form.Control
                    name="address"
                    onChange={handleParkingInfo}
                    value={editParkingInfo?.address}
                    type="name"
                    placeholder=""
                  />
                </Form.Group>
                <Button type="submit">Изменить</Button>
              </Form>
            </div>
          </Tab>
        </Tabs>
      )}
    </>
  )
}

export default Settings
