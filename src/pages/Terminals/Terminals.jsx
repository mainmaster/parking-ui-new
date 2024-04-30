import { Button, Form, Modal as CustomModal } from 'react-bootstrap';
import { useState } from 'react';
import Modal from 'components/Modal';
import {
  useTerminalsQuery,
  useCreateTerminalMutation,
  useDeleteTerminalMutation,
  useEditTerminalMutation
} from 'api/terminal/terminal.api';
import { useSnackbar } from 'notistack';
import { TerminalItem } from './TerminalItem';
import css from './CamerasPage.module.scss';
import _ from 'lodash';

export const Terminals = () => {
  const { data: terminals } = useTerminalsQuery();
  const [modalActive, setModalActive] = useState(false);
  const [modalEditActive, setModalEditActive] = useState(false);
  const [terminalEditData, setTerminalEditData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [createTerminal] = useCreateTerminalMutation();
  const [deleteTerminal] = useDeleteTerminalMutation();
  const [editTerminal] = useEditTerminalMutation();
  const [terminalsFormData, setTerminalsFormData] = useState({
    description: '',
    address: '',
    place: '',
    automat_number: '',
    ip_address: '',
    terminal_type: '',
    port: '4455'
  });

  const submitForm = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await createTerminal(terminalsFormData);

    if ('data' in result) {
      enqueueSnackbar('Терминал добавлен', { variant: 'success' });
      setTerminalsFormData({
        description: '',
        address: '',
        place: '',
        automat_number: '',
        ip_address: '',
        terminal_type: '',
        port: '4455'
      });
      setModalActive(false);
    }
  };
  const submitEditTerminal = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await editTerminal(terminalEditData);

    if ('data' in result) {
      enqueueSnackbar('Терминал изменен', { variant: 'success' });
      setModalEditActive(false);
    }
  };

  return (
    <div className="mb-3">
      <Button className="mb-4 mt-3" onClick={() => setModalActive(true)}>
        Добавить терминал
      </Button>
      <Modal
        show={modalActive}
        handleClose={() => setModalActive(false)}
        header={<CustomModal.Title>Добавить терминал</CustomModal.Title>}
        body={
          <Form onSubmit={submitForm}>
            <Form.Group>
              <Form.Label>Описание</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="name"
                value={terminalsFormData.description}
                onChange={(e) =>
                  setTerminalsFormData({
                    ...terminalsFormData,
                    description: e.target.value
                  })
                }
              />
              <Form.Label>Адрес</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="name"
                value={terminalsFormData.address}
                onChange={(e) =>
                  setTerminalsFormData({
                    ...terminalsFormData,
                    address: e.target.value
                  })
                }
              />
              <Form.Label>Место</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="name"
                value={terminalsFormData.place}
                onChange={(e) =>
                  setTerminalsFormData({
                    ...terminalsFormData,
                    place: e.target.value
                  })
                }
              />
              <Form.Label>Номер автомата</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="name"
                value={terminalsFormData.automat_number}
                onChange={(e) =>
                  setTerminalsFormData({
                    ...terminalsFormData,
                    automat_number: e.target.value
                  })
                }
              />
              <Form.Label>IP адрес</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="text"
                value={terminalsFormData.ip_address}
                onChange={(e) =>
                  setTerminalsFormData({
                    ...terminalsFormData,
                    ip_address: e.target.value
                  })
                }
              />
              <Form.Label>Тип</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setTerminalsFormData({
                    ...terminalsFormData,
                    terminal_type: e.target.value
                  })
                }
                name="terminal_type"
                className="mb-3"
              >
                <option value="aqsi">aqsi</option>
                <option value="vendotek">vendotek</option>
              </Form.Select>
              <Form.Label>Порт</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="text"
                value={terminalsFormData.port}
                onChange={(e) =>
                  setTerminalsFormData({
                    ...terminalsFormData,
                    port: e.target.value
                  })
                }
              />
              <Button type="submit">Создать</Button>
            </Form.Group>
          </Form>
        }
      />

      <Modal
        show={modalEditActive}
        handleClose={() => setModalEditActive(false)}
        header={<CustomModal.Title>Редактировать терминал</CustomModal.Title>}
        body={
          <Form onSubmit={submitEditTerminal}>
            <Form.Group>
              <Form.Label>Описание</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="name"
                value={terminalEditData?.description}
                onChange={(e) =>
                  setTerminalEditData({
                    ...terminalEditData,
                    description: e.target.value
                  })
                }
              />
              <Form.Label>Адрес</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="name"
                value={terminalEditData?.address}
                onChange={(e) =>
                  setTerminalEditData({
                    ...terminalEditData,
                    address: e.target.value
                  })
                }
              />
              <Form.Label>Место</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="name"
                value={terminalEditData?.place}
                onChange={(e) =>
                  setTerminalEditData({
                    ...terminalEditData,
                    place: e.target.value
                  })
                }
              />
              <Form.Label>Номер автомата</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="name"
                value={terminalEditData?.automat_number}
                onChange={(e) =>
                  setTerminalEditData({
                    ...terminalEditData,
                    automat_number: e.target.value
                  })
                }
              />
              <Form.Label>IP адрес</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="text"
                value={terminalEditData?.ip_address}
                onChange={(e) =>
                  setTerminalEditData({
                    ...terminalEditData,
                    ip_address: e.target.value
                  })
                }
              />
              <Form.Label>Тип</Form.Label>
              <Form.Select
                value={terminalEditData?.terminal_type}
                onChange={(e) =>
                  setTerminalEditData({
                    ...terminalEditData,
                    terminal_type: e.target.value
                  })
                }
                name="terminal_type"
                className="mb-3"
              >
                <option value="aqsi">aqsi</option>
                <option value="vendotek">vendotek</option>
              </Form.Select>
              <Form.Label>Порт</Form.Label>
              <Form.Control
                required
                className="mb-3"
                type="text"
                value={terminalEditData?.port}
                onChange={(e) =>
                  setTerminalEditData({
                    ...terminalsFormData,
                    port: e.target.value
                  })
                }
              />
              <Button type="submit">Изменить</Button>
            </Form.Group>
          </Form>
        }
      />

      <div className={css.cards + ` mt-3`}>
        {_.sortBy(terminals, ['id'])?.map((terminal) => {
          return (
            <TerminalItem
              setEditData={setTerminalEditData}
              deleteTerminal={deleteTerminal}
              terminal={terminal}
              showModal={setModalEditActive}
            />
          );
        })}
      </div>
    </div>
  );
};
