import { Button, Form, Modal as CustomModal } from 'react-bootstrap'
import Modal from 'components/Modal'
import { useRef, useState } from 'react'
import { useSnackbar } from 'notistack'
import Input from 'components/Input'
import { Formik } from 'formik'
import { useParkingInfoQuery } from '../../api/settings/settings'
import FilterForm from '../../components/pages/applications/FilterForm'
import { CompanySelect } from '../../components/pages/applications/FilterForm/CompanySelect'
import EditApplicationModal from './EditApplicationModal'
import PaginationCustom from 'components/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import {
    applicationsChangePageFetch,
  applicationsFetch,
  changeCurrentPage,
  createApplicationsFetch,
  deleteApplicationFetch,
  setEditApplication,
} from '../../store/applications/applicationSlice'
import Table from 'components/Table'
import { useEffect } from 'react'
import { rows, titles } from './tableData'


export const Applications = () => {
  const showEditModal = useSelector(
    (state) => state.applications.editApplication.edit
  )
  const [modalActive, setModalActive] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { data: parkingInfo } = useParkingInfoQuery()

  const applications = useSelector((state) => state.applications.applications)
  const currentPage = useSelector((state) => state.applications.currentPage)
  const pages = useSelector((state) => state.applications.pages)

  const dispatch = useDispatch()
  const formikRef = useRef()

  const closeEditModal = () => {
    dispatch(
      setEditApplication({
        edit: false,
        application: null,
      })
    )
  }

  const deleteApplication = (id) => {
    dispatch(deleteApplicationFetch(id))
  }

  const editApplication = (application) => {
    dispatch(
      setEditApplication({
        edit: true,
        application: application,
      })
    )
  }

  const defaultValues = {
    vehicle_plate: '',
  }

  const submitCreateApplication = async (values) => {
    dispatch(createApplicationsFetch(values))
    enqueueSnackbar('Заявка добавлена', { variant: 'success' })
    setModalActive(false)
  }

  const changePage = (index) => {
    dispatch(applicationsChangePageFetch(index))
  }

  useEffect(() => {
    dispatch(applicationsFetch())
    return () => dispatch(changeCurrentPage(1))
  }, [dispatch])

  return (
    <div>
      <FilterForm />

      <Button className="mb-4 mt-3" onClick={() => setModalActive(true)}>
        Добавить заявку
      </Button>

      <h3>Количество заявок: {applications?.count}</h3>
      <Table
        titles={titles}
        rows={rows(applications?.requests, deleteApplication, editApplication)}
      />
      <EditApplicationModal handleClose={closeEditModal} show={showEditModal} />

      <Modal
        show={modalActive}
        handleClose={() => setModalActive(false)}
        header={<CustomModal.Title>Создать заявку</CustomModal.Title>}
        body={
          <Formik
            initialValues={defaultValues}
            onSubmit={submitCreateApplication}
            innerRef={formikRef}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <Form.Group>
                  <Input
                    required
                    label="Номер машины"
                    className="mb-3"
                    type="text"
                    name="vehicle_plate"
                    onChange={(e) =>
                      props.setFieldValue('vehicle_plate', e.target.value)
                    }
                  />
                  <Input
                    required
                    label="Дата"
                    className="mb-3"
                    name="valid_for_date"
                    onChange={(e) =>
                      props.setFieldValue('valid_for_date', e.target.value)
                    }
                    type="date"
                  />
                  {parkingInfo.userType !== 'renter' && (
                    <CompanySelect on_id props={props} />
                  )}
                  <Button type="submit">Создать</Button>
                </Form.Group>
              </form>
            )}
          </Formik>
        }
      />
      <PaginationCustom
        pages={pages}
        changePage={changePage}
        currentPage={currentPage}
      />
    </div>
  )
}
