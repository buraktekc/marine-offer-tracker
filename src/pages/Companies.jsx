import { AlertCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import CompanyForm from '../components/companies/CompanyForm'
import CompanyList from '../components/companies/CompanyList'
import { useCompanies } from '../hooks/useCompanies'

function Companies() {
  const {
    createCompany,
    data: companies,
    error,
    isLoading,
    softDeleteCompany,
    updateCompany,
  } = useCompanies()
  const [editingCompany, setEditingCompany] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [notice, setNotice] = useState(null)

  const isSubmitting = createCompany.isPending || updateCompany.isPending

  function openNewCompanyForm() {
    setEditingCompany(null)
    setNotice(null)
    setIsFormOpen(true)
  }

  function openEditCompanyForm(company) {
    setEditingCompany(company)
    setNotice(null)
    setIsFormOpen(true)
  }

  function closeForm() {
    setEditingCompany(null)
    setIsFormOpen(false)
  }

  async function handleSubmit(payload) {
    setNotice(null)

    try {
      if (editingCompany) {
        await updateCompany.mutateAsync({
          id: editingCompany.id,
          ...payload,
        })
        setNotice({ type: 'success', text: 'Company updated.' })
      } else {
        await createCompany.mutateAsync(payload)
        setNotice({ type: 'success', text: 'Company created.' })
      }

      closeForm()
    } catch (submitError) {
      setNotice({ type: 'error', text: submitError.message })
    }
  }

  async function handleDelete(company) {
    const shouldDelete = window.confirm(
      `Set ${company.name} as inactive? Existing records will remain linked.`,
    )

    if (!shouldDelete) return

    setNotice(null)

    try {
      await softDeleteCompany.mutateAsync(company.id)
      setNotice({ type: 'success', text: 'Company set inactive.' })
    } catch (deleteError) {
      setNotice({ type: 'error', text: deleteError.message })
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-brand">
            Companies
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">
            Companies
          </h1>
        </div>

        <button
          className="inline-flex h-10 items-center gap-2 rounded bg-teal-brand px-4 text-sm font-semibold text-sidebar transition hover:bg-teal-brand/90"
          onClick={openNewCompanyForm}
          type="button"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Company
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

      {error ? (
        <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {error.message}
        </div>
      ) : null}

      {isFormOpen ? (
        <CompanyForm
          initialCompany={editingCompany}
          initialTerms={editingCompany?.company_terms}
          isSubmitting={isSubmitting}
          key={editingCompany?.id || 'new-company'}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      ) : null}

      <CompanyList
        companies={companies}
        isLoading={isLoading}
        onDelete={handleDelete}
        onEdit={openEditCompanyForm}
      />
    </section>
  )
}

export default Companies
