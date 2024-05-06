import { Button, Form, Modal as CustomModal } from 'react-bootstrap';
import Table from 'components/Table';
import Modal from 'components/Modal';
import { rentersTitles, rentersRows } from './tableData';
import {
  useCreateRentersMutation,
  useActivateRenterMutation,
  useDeactivateRenterMutation,
  useLazyRentersQuery
} from '../../api/renters/renters.api';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import PaginationCustom from 'components/Pagination';
import { getPageNum } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { setEditRenter } from '../../store/renters/rentersSlice';
import EditRenterModal from './EditRenterModal';

export const Renters = () => {
  const [getData, { data: renters }] = useLazyRentersQuery();
  const [activateRenter] = useActivateRenterMutation();
  const [deactivateRenter] = useDeactivateRenterMutation();
  const [createRenter] = useCreateRentersMutation();
  const [modalActive, setModalActive] = useState(false);
  const [renterFormData, setRenterFormData] = useState({
    contacts: null
  });
  const [elementsCount, setElementsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 50
  });

  const { enqueueSnackbar } = useSnackbar();
  const showEditModal = useSelector((state) => state.renters.editRenter.edit);

  const formRef = useRef();
  const dispatch = useDispatch();

  const handleCloseEditModal = () => {
    dispatch(
      setEditRenter({
        edit: false,
        renter: null
      })
    );
  };

  useEffect(() => {
    const fetchPages = async () => {
      const result = await getData({ ...pagination });
      if ('data' in result) {
        setElementsCount(result.count);
      }
    };
    fetchPages();
  }, [getData, pagination, renters, currentPage]);

  const submitCreateRenter = async (e, value) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await createRenter(renterFormData);
    if ('data' in result) {
      enqueueSnackbar('Арендатор добавлен', { variant: 'success' });
      setRenterFormData({
        username: '',
        password: '',
        company_name: ''
      });
      setModalActive(false);
    }
  };

  const editRenter = (renter) => {
    dispatch(
      setEditRenter({
        edit: true,
        renter: renter
      })
    );
  };

  return (
    <div>
      <Button className="mb-4 mt-3" onClick={() => setModalActive(true)}>
        Добавить арендатора
      </Button>
      <EditRenterModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
      />

      <Modal
        show={modalActive}
        handleClose={() => setModalActive(false)}
        header={<CustomModal.Title>Создать арендатора</CustomModal.Title>}
        body={
          <Form ref={formRef} onSubmit={submitCreateRenter}>
            <Form.Group>
              <Form.Label>Логин</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="text"
                value={renterFormData.username}
                onChange={(e) =>
                  setRenterFormData({
                    ...renterFormData,
                    username: e.target.value
                  })
                }
              />
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="text"
                name="password"
                value={renterFormData.password}
                onChange={(e) =>
                  setRenterFormData({
                    ...renterFormData,
                    password: e.target.value
                  })
                }
              />
              <Form.Label>Контакты</Form.Label>
              <Form.Control
                className="mb-3"
                type="text"
                name="contacts"
                value={renterFormData.contacts}
                onChange={(e) =>
                  setRenterFormData({
                    ...renterFormData,
                    contacts: e.target.value
                  })
                }
              />
              <Form.Label>Арендатор</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="text"
                name="company_name"
                value={renterFormData.company_name}
                onChange={(e) =>
                  setRenterFormData({
                    ...renterFormData,
                    company_name: e.target.value
                  })
                }
              />
              <Button type="submit">Создать</Button>
            </Form.Group>
          </Form>
        }
      />
      <h4 className="mb-4">Арендаторы</h4>

      {renters && (
        <Table
          titles={rentersTitles}
          rows={rentersRows(
            renters?.renters,
            activateRenter,
            deactivateRenter,
            editRenter
          )}
        />
      )}

      {renters && (
        <PaginationCustom
          pages={renters.count}
          changePage={(e) => {
            setPagination({ ...pagination, offset: getPageNum(e) * 5 });
            setCurrentPage(e);
          }}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};
