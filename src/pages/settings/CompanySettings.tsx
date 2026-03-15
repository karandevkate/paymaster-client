import React, { useEffect, useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import {
  fetchPayrollConfigurationByCompanyId,
  updatePayrollConfig,
  addPayrollConfiguration,
  PayrollConfigurationRequest
} from '@/src/services/apiService';
import { CompanySettings } from '../../types';

export const CompanySettingsPage: React.FC = () => {
  const userJson = localStorage.getItem('user');
  const storedCompanyId = userJson ? JSON.parse(userJson).companyId : '';

  const [settings, setSettings] = useState<PayrollConfigurationRequest>({
    companyId: storedCompanyId,

    hraApplicable: false,
    conveyanceApplicable: false,
    medicalApplicable: false,
    bonusApplicable: false,

    hraPercentage: 0,
    conveyancePercentage: 0,
    medicalAllowanceAmount: 0,
    bonusPercentage: 0,

    isPfApplicable: false,
    isEsicApplicable: false,

    pfEmployeePercentage: 0,
    pfEmployerPercentage: 0,
    esiEmployeePercentage: 0,
    esiEmployerPercentage: 0,
    professionalTax: 0,

    taxSlab1Limit: 0,
    taxSlab1Rate: 0,
    taxSlab2Limit: 0,
    taxSlab2Rate: 0,
    taxSlab3Limit: 0,
    taxSlab3Rate: 0,
    isActive: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewConfig, setIsNewConfig] = useState(true);

  // Load existing config
  useEffect(() => {
    const loadConfig = async () => {
      if (!storedCompanyId) {
        setError('Company ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data: CompanySettings | null =
          await fetchPayrollConfigurationByCompanyId(storedCompanyId);

        if (data) {
          setSettings({
            companyId: data.companyId,

            hraApplicable: data.hraApplicable ?? false,
            conveyanceApplicable: data.conveyanceApplicable ?? false,
            medicalApplicable: data.medicalApplicable ?? false,
            bonusApplicable: data.bonusApplicable ?? false,

            hraPercentage: data.hraPercentage ?? 0,
            conveyancePercentage: data.conveyancePercentage ?? 0,
            medicalAllowanceAmount: data.medicalAllowanceAmount ?? 0,
            bonusPercentage: data.bonusPercentage ?? 0,

            isPfApplicable: data.isPfApplicable ?? false,
            isEsicApplicable: data.isEsicApplicable ?? false,

            pfEmployeePercentage: data.pfEmployeePercentage ?? 0,
            pfEmployerPercentage: data.pfEmployerPercentage ?? 0,
            esiEmployeePercentage: data.esiEmployeePercentage ?? 0,
            esiEmployerPercentage: data.esiEmployerPercentage ?? 0,
            professionalTax: data.professionalTax ?? 0,

            taxSlab1Limit: data.taxSlab1Limit ?? 0,
            taxSlab1Rate: data.taxSlab1Rate ?? 0,
            taxSlab2Limit: data.taxSlab2Limit ?? 0,
            taxSlab2Rate: data.taxSlab2Rate ?? 0,
            taxSlab3Limit: data.taxSlab3Limit ?? 0,
            taxSlab3Rate: data.taxSlab3Rate ?? 0,
            isActive: data.isActive ?? true
          });
          setIsNewConfig(false);
        } else {
          setIsNewConfig(true);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [storedCompanyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value) || 0
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!settings.companyId) throw new Error('Company ID is required');

      if (isNewConfig) {
        await addPayrollConfiguration(settings);
        toast.success('Payroll configuration added successfully!');
        setIsNewConfig(false);
      } else {
        await updatePayrollConfig(settings);
        toast.success('Payroll configuration updated successfully!');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to save';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5 text-muted">Loading configuration...</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4">
        <h2 className="mb-4 fw-bold">Company Payroll Configuration</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSave}>
          <div className="row g-4">
            {/* Left: Allowances */}
            <div className="col-lg-6">
              <div className="card h-100 p-4">
                <h5 className="border-bottom pb-2 mb-3">Allowances</h5>

                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" name="hraApplicable" id="hraApplicable" checked={settings.hraApplicable} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="hraApplicable">HRA Applicable</label>
                </div>
                {settings.hraApplicable && (
                  <Input label="HRA %" name="hraPercentage" type="number" step="0.01" value={settings.hraPercentage} onChange={handleChange} />
                )}

                <div className="form-check mb-3 mt-4">
                  <input type="checkbox" className="form-check-input" name="conveyanceApplicable" id="conveyanceApplicable" checked={settings.conveyanceApplicable} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="conveyanceApplicable">Conveyance Applicable</label>
                </div>
                {settings.conveyanceApplicable && (
                  <Input label="Conveyance %" name="conveyancePercentage" type="number" step="0.01" value={settings.conveyancePercentage} onChange={handleChange} />
                )}

                <div className="form-check mb-3 mt-4">
                  <input type="checkbox" className="form-check-input" name="medicalApplicable" id="medicalApplicable" checked={settings.medicalApplicable} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="medicalApplicable">Medical Allowance Applicable</label>
                </div>
                {settings.medicalApplicable && (
                  <Input label="Medical Allowance (₹)" name="medicalAllowanceAmount" type="number" step="0.01" value={settings.medicalAllowanceAmount} onChange={handleChange} />
                )}

                <div className="form-check mb-3 mt-4">
                  <input type="checkbox" className="form-check-input" name="bonusApplicable" id="bonusApplicable" checked={settings.bonusApplicable} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="bonusApplicable">Bonus Applicable</label>
                </div>
                {settings.bonusApplicable && (
                  <Input label="Bonus %" name="bonusPercentage" type="number" step="0.01" value={settings.bonusPercentage} onChange={handleChange} />
                )}
              </div>
            </div>


            <div className="col-lg-6">
              <div className="card h-100 p-4">
                <h5 className="border-bottom pb-2 mb-3">Statutory Deductions</h5>

                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" name="isPfApplicable" id="isPfApplicable" checked={settings.isPfApplicable} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="isPfApplicable">PF Applicable</label>
                </div>
                {settings.isPfApplicable && (
                  <div className="row g-2">
                    <div className="col-md-6">
                      <Input label="PF Employee %" name="pfEmployeePercentage" type="number" step="0.01" value={settings.pfEmployeePercentage} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <Input label="PF Employer %" name="pfEmployerPercentage" type="number" step="0.01" value={settings.pfEmployerPercentage} onChange={handleChange} />
                    </div>
                  </div>
                )}

                <div className="form-check mb-3 mt-4">
                  <input type="checkbox" className="form-check-input" name="isEsicApplicable" id="isEsicApplicable" checked={settings.isEsicApplicable} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="isEsicApplicable">ESIC Applicable</label>
                </div>
                {settings.isEsicApplicable && (
                  <div className="row g-2">
                    <div className="col-md-6">
                      <Input label="ESI Employee %" name="esiEmployeePercentage" type="number" step="0.01" value={settings.esiEmployeePercentage} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <Input label="ESI Employer %" name="esiEmployerPercentage" type="number" step="0.01" value={settings.esiEmployerPercentage} onChange={handleChange} />
                    </div>
                  </div>
                )}

                <div className="mt-4">
                   <Input label="Professional Tax (₹)" name="professionalTax" type="number" value={settings.professionalTax} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {/* Income Tax Slabs */}
          <div className="mt-5">
            <div className="card p-4">
              <h5 className="border-bottom pb-2 mb-3">Income Tax Slabs (Annual)</h5>
              <div className="row g-3">
                <div className="col-md-4"><Input label="Slab 1 Limit (₹)" name="taxSlab1Limit" type="number" value={settings.taxSlab1Limit} onChange={handleChange} /></div>
                <div className="col-md-4"><Input label="Slab 1 Rate %" name="taxSlab1Rate" type="number" step="0.01" value={settings.taxSlab1Rate} onChange={handleChange} /></div>
              </div>
              <div className="row g-3 mt-2">
                <div className="col-md-4"><Input label="Slab 2 Limit (₹)" name="taxSlab2Limit" type="number" value={settings.taxSlab2Limit} onChange={handleChange} /></div>
                <div className="col-md-4"><Input label="Slab 2 Rate %" name="taxSlab2Rate" type="number" step="0.01" value={settings.taxSlab2Rate} onChange={handleChange} /></div>
              </div>
              <div className="row g-3 mt-2">
                <div className="col-md-4"><Input label="Slab 3 Limit (₹)" name="taxSlab3Limit" type="number" value={settings.taxSlab3Limit} onChange={handleChange} /></div>
                <div className="col-md-4"><Input label="Slab 3 Rate %" name="taxSlab3Rate" type="number" step="0.01" value={settings.taxSlab3Rate} onChange={handleChange} /></div>
              </div>
            </div>
          </div>

          <div className="form-check form-switch mt-4 fs-5">
            <input className="form-check-input" type="checkbox" role="switch" id="isActive" name="isActive" checked={settings.isActive} onChange={handleChange} />
            <label className="form-check-label" htmlFor="isActive">Configuration Active</label>
          </div>

          {/* Save Button */}
          <div className="text-end mt-4">
            <Button type="submit" size="lg" isLoading={saving}>
              {isNewConfig ? 'Create Configuration' : 'Update Configuration'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
