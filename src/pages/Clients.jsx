import { Edit3, Mail, MapPin, Phone, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../components/common/Button.jsx";
import Card from "../components/common/Card.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Modal from "../components/common/Modal.jsx";
import ClientForm from "../components/forms/ClientForm.jsx";
import { deleteClient, getClients, saveClient } from "../services/storageService.js";
import { formatDate } from "../utils/formatters.js";
import PageShell from "./PageShell.jsx";

function Clients() {
  const [clients, setClients] = useState([]);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setClients(getClients());
  }, []);

  function openCreateModal() {
    setEditingClient(null);
    setIsFormOpen(true);
  }

  function openEditModal(client) {
    setEditingClient(client);
    setIsFormOpen(true);
  }

  function closeFormModal() {
    setEditingClient(null);
    setIsFormOpen(false);
  }

  function handleSaveClient(client) {
    saveClient(client);
    setClients(getClients());
    closeFormModal();
  }

  function handleDeleteClient() {
    if (!clientToDelete) {
      return;
    }

    setClients(deleteClient(clientToDelete.id));
    setClientToDelete(null);
  }

  return (
    <>
      <PageShell
        description="Create and manage the client records that power proposals, invoices, contracts, and email templates."
        eyebrow="CRM Lite"
        title="Clients"
        actions={
          <Button type="button" onClick={openCreateModal}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add client
          </Button>
        }
      >
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-zinc-950">Client list</h3>
              <p className="mt-1 text-sm text-zinc-600">
                {clients.length} {clients.length === 1 ? "client" : "clients"} stored in this browser.
              </p>
            </div>
          </div>

          {clients.length === 0 ? (
            <EmptyState
              actionLabel="Add client"
              description="Client records include contact details, notes, and timestamps for reusable document context."
              onAction={openCreateModal}
              title="No clients yet"
            />
          ) : (
            <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
              {clients.map((client) => (
                <article
                  className="grid gap-4 bg-white p-4 transition hover:bg-stone-50 lg:grid-cols-[1fr_auto]"
                  key={client.id}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="truncate text-base font-semibold text-zinc-950">
                        {client.clientName}
                      </h4>
                      {client.companyName ? (
                        <span className="text-sm text-zinc-500">{client.companyName}</span>
                      ) : null}
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-zinc-600 md:grid-cols-3">
                      <span className="flex min-w-0 items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                        <span className="truncate">{client.email || "No email"}</span>
                      </span>
                      <span className="flex min-w-0 items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                        <span className="truncate">{client.phone || "No phone"}</span>
                      </span>
                      <span className="flex min-w-0 items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                        <span className="truncate">{client.address || "No address"}</span>
                      </span>
                    </div>
                    {client.notes ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
                        {client.notes}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs text-zinc-500">
                      Updated {formatDate(client.updatedAt)}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 lg:justify-end">
                    <Button
                      className="h-9 px-3"
                      type="button"
                      variant="secondary"
                      onClick={() => openEditModal(client)}
                    >
                      <Edit3 className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      className="h-9 px-3"
                      type="button"
                      variant="ghost"
                      onClick={() => setClientToDelete(client)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </PageShell>

      <Modal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        title={editingClient ? "Edit client" : "Add client"}
      >
        <ClientForm
          initialValues={editingClient}
          onCancel={closeFormModal}
          onSubmit={handleSaveClient}
          submitLabel={editingClient ? "Save changes" : "Create client"}
        />
      </Modal>

      <ConfirmDialog
        description={
          clientToDelete
            ? `Delete ${clientToDelete.clientName}? This removes the client record from local storage.`
            : "Delete this client?"
        }
        isOpen={Boolean(clientToDelete)}
        onCancel={() => setClientToDelete(null)}
        onConfirm={handleDeleteClient}
        title="Delete client"
      />
    </>
  );
}

export default Clients;
