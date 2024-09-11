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
import React, { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import PaginationCustom from 'components/Pagination';
import { getPageNum } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { setEditRenter } from '../../store/renters/rentersSlice';
import EditRenterModal from './EditRenterModal';
import {useTranslation} from "react-i18next";

export const Renters = () => {
  const { t } = useTranslation();
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
      enqueueSnackbar(t('pages.renters.renterAdded'), { variant: 'success' });
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
        {t('pages.renters.addRenter')}
      </Button>
      <EditRenterModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
      />

      <Modal
        show={modalActive}
        handleClose={() => setModalActive(false)}
        header={<CustomModal.Title>{t('pages.renters.createRenter')}</CustomModal.Title>}
        body={
          <Form ref={formRef} onSubmit={submitCreateRenter}>
            <Form.Group>
              <Form.Label>{t('pages.renters.login')}</Form.Label>
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
              <Form.Label>{t('pages.renters.password')}</Form.Label>
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
              <Form.Label>{t('pages.renters.contacts')}</Form.Label>
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
              <Form.Label>{t('pages.renters.renter')}</Form.Label>
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
              <Form.Check
                label={t('pages.renters.blockCarPark')}
                name='no_check_needed'
                type='checkbox'
                className='mt-2 mb-2'
                onChange={(e) => {
                  setRenterFormData({
                    ...renterFormData,
                    car_park_disabled: e.target.checked
                  })
                }}
              />
              <Button type="submit">{t('pages.renters.create')}</Button>
            </Form.Group>
          </Form>
        }
      />
      <h4 className="mb-4">{t('pages.renters.renters')}</h4>

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
