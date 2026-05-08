import { AlertCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import VesselForm from '../components/vessels/VesselForm'
import VesselList from '../components/vessels/VesselList'
import { useCompanies } from '../hooks/useCompanies'
import { useVessels } from '../hooks/useVessels'

function Vessels() {
  const {
    data: companies,
    error: companiesError,
    isLoading: isLoadingCompanies,
  } = useCompanies()
  const {
    createVessel,
    data: vessels,
    error: vesselsError,
    isLoading: isLoadingVessels,
    softDeleteVessel,
    updateVessel,
  } = useVessels()
  const [editingVessel, setEditingVessel] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [notice, setNotice] = useState(null)

  const isSubmitting = createVessel.isPending || updateVessel.isPending
  const pageError = companiesError || vesselsError

  function openNewVesselForm() {
    setEditingVessel(null)
    setNotice(null)
    setIsFormOpen(true)
  }

  function openEditVesselForm(vessel) {
    setEditingVessel(vessel)
    setNotice(null)
    setIsFormOpen(true)
  }

  function closeForm() {
    setEditingVessel(null)
    setIsFormOpen(false)
  }

  async function handleSubmit(payload) {
    setNotice(null)

    try {
      if (editingVessel) {
        await updateVessel.mutateAsync({
          id: editingVessel.id,
          ...payload,
        })
        setNotice({ type: 'success', text: 'Vessel updated.' })
      } else {
        await createVessel.mutateAsync(payload)
        setNotice({ type: 'success', text: 'Vessel created.' })
      }

      closeForm()
    } catch (submitError) {
      setNotice({ type: 'error', text: submitError.message })
    }
  }

  async function handleDelete(vessel) {
    const shouldDelete = window.confirm(
      `Set ${vessel.name} as inactive? Existing records will remain linked.`,
    )

    if (!shouldDelete) return

    setNotice(null)

    try {
      await softDeleteVessel.mutateAsync(vessel.id)
      setNotice({ type: 'success', text: 'Vessel set inactive.' })
    } catch (deleteError) {
      setNotice({ type: 'error', text: deleteError.message })
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-brand">
            Vessels
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">
            Vessels
          </h1>
        </div>

        <button
          className="inline-flex h-10 items-center gap-2 rounded bg-teal-brand px-4 text-sm font-semibold text-sidebar transition hover:bg-teal-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!companies?.length}
          onClick={openNewVesselForm}
          type="button"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Vessel
        </button>
      </div>

      {notice ? (
        <div
          className={[
            'rounded border px-4 py-3 text-sm',
            notice.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-teal-brand/20 bg-teal-brand/10 text-slate-700',
          ].join(' ')}
        >
          {notice.text}
        </div>
      ) : null}

      {pageError ? (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {pageError.message}
        </div>
      ) : null}

      {!isLoadingCompanies && !companies?.length ? (
        <div className="rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          Create an active company before adding vessels.
        </div>
      ) : null}

      {isFormOpen ? (
        <VesselForm
          companies={companies || []}
          initialTerms={editingVessel?.vessel_terms}
          initialVessel={editingVessel}
          isSubmitting={isSubmitting}
          key={editingVessel?.id || 'new-vessel'}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      ) : null}

      <VesselList
        isLoading={isLoadingVessels || isLoadingCompanies}
        onDelete={handleDelete}
        onEdit={openEditVesselForm}
        vessels={vessels}
      />
    </section>
  )
}

export default Vessels
