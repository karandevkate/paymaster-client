import React, { useEffect, useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import {
  fetchPayrollConfigurationByCompanyId,
  updatePayrollConfig,
  PayrollConfigurationRequestDto,
  PayrollConfigurationResponseDto,
  addPayrollConfiguration
} from '@/src/services/apiService';

export const CompanySettingsPage: React.FC = () => {
  const storedCompanyId = localStorage.getItem('companyId') || '';

  const [settings, setSettings] = useState<PayrollConfigurationRequestDto>({
    companyId: storedCompanyId,

    hraApplicable: false,
    conveyanceApplicable: false,
    medicalApplicable: false,

    hraPercentage: 0,
    conveyanceAmount: 0,
    medicalAllowanceAmount: 0,

    pfApplicable: false,
    esiApplicable: false,

    pfEmployeePercentage: 0,
    pfEmployerPercentage: 0,
    esiEmployeePercentage: 0,
    esiEmployerPercentage: 0,

    taxSlab1Limit: 0,
    taxSlab1Rate: 0,
    taxSlab2Limit: 0,
    taxSlab2Rate: 0,
    taxSlab3Rate: 0
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
        const data: PayrollConfigurationResponseDto | null =
          await fetchPayrollConfigurationByCompanyId(storedCompanyId);

        if (data) {
          setSettings({
            companyId: data.companyId,

            hraApplicable: data.hraApplicable ?? false,
            conveyanceApplicable: data.conveyanceApplicable ?? false,
            medicalApplicable: data.medicalApplicable ?? false,

            hraPercentage: data.hraPercentage ?? 0,
            conveyanceAmount: data.conveyanceAmount ?? 0,
            medicalAllowanceAmount: data.medicalAllowanceAmount ?? 0,

            pfApplicable: data.pfApplicable ?? false,
            esiApplicable: data.esiApplicable ?? false,

            pfEmployeePercentage: data.pfEmployeePercentage ?? 0,
            pfEmployerPercentage: data.pfEmployerPercentage ?? 0,
            esiEmployeePercentage: data.esiEmployeePercentage ?? 0,
            esiEmployerPercentage: data.esiEmployerPercentage ?? 0,

            taxSlab1Limit: data.taxSlab1Limit ?? 0,
            taxSlab1Rate: data.taxSlab1Rate ?? 0,
            taxSlab2Limit: data.taxSlab2Limit ?? 0,
            taxSlab2Rate: data.taxSlab2Rate ?? 0,
            taxSlab3Rate: data.taxSlab3Rate ?? 0
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
                  <input type="checkbox" className="form-check-input" name="hraApplicable" checked={settings.hraApplicable} onChange={handleChange} />
                  <label className="form-check-label">HRA Applicable</label>
                </div>
                {settings.hraApplicable && (
                  <Input label="HRA %" name="hraPercentage" type="text" value={settings.hraPercentage} onChange={handleChange} />
                )}

                <div className="form-check mb-3 mt-4">
                  <input type="checkbox" className="form-check-input" name="conveyanceApplicable" checked={settings.conveyanceApplicable} onChange={handleChange} />
                  <label className="form-check-label">Conveyance Applicable</label>
                </div>
                {settings.conveyanceApplicable && (
                  <Input label="Conveyance Amount (₹)" name="conveyanceAmount" type="text" value={settings.conveyanceAmount} onChange={handleChange} />
                )}

                <div className="form-check mb-3 mt-4">
                  <input type="checkbox" className="form-check-input" name="medicalApplicable" checked={settings.medicalApplicable} onChange={handleChange} />
                  <label className="form-check-label">Medical Allowance Applicable</label>
                </div>
                {settings.medicalApplicable && (
                  <Input label="Medical Allowance (₹)" name="medicalAllowanceAmount" type="text" value={settings.medicalAllowanceAmount} onChange={handleChange} />
                )}
              </div>
            </div>

            {/* Right: Deductions */}
            <div className="col-lg-6">
              <div className="card h-100 p-4">
                <h5 className="border-bottom pb-2 mb-3">Statutory Deductions</h5>

                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" name="pfApplicable" checked={settings.pfApplicable} onChange={handleChange} />
                  <label className="form-check-label">PF Applicable</label>
                </div>
                {settings.pfApplicable && (
                  <>
                    <Input label="PF Employee %" name="pfEmployeePercentage" type="text" step="0.01" value={settings.pfEmployeePercentage} onChange={handleChange} />
                    <Input label="PF Employer %" name="pfEmployerPercentage" type="text" step="0.01" value={settings.pfEmployerPercentage} onChange={handleChange} />
                  </>
                )}

                <div className="form-check mb-3 mt-4">
                  <input type="checkbox" className="form-check-input" name="esiApplicable" checked={settings.esiApplicable} onChange={handleChange} />
                  <label className="form-check-label">ESI Applicable</label>
                </div>
                {settings.esiApplicable && (
                  <>
                    <Input label="ESI Employee %" name="esiEmployeePercentage" type="text" step="0.01" value={settings.esiEmployeePercentage} onChange={handleChange} />
                    <Input label="ESI Employer %" name="esiEmployerPercentage" type="text" step="0.01" value={settings.esiEmployerPercentage} onChange={handleChange} />
                  </>
                )}

                <div className="alert alert-info mt-4">
                  <strong>Professional Tax</strong> is calculated automatically based on Maharashtra rules (gender + salary slab + February surcharge).
                </div>
              </div>
            </div>
          </div>

          {/* Income Tax Slabs */}
          <div className="mt-5">
            <div className="card p-4">
              <h5 className="border-bottom pb-2 mb-3">Income Tax Slabs (Annual)</h5>
              <div className="row g-3">
                <div className="col-md-4"><Input label="Up to ₹" name="taxSlab1Limit" type="text" value={settings.taxSlab1Limit} onChange={handleChange} /></div>
                <div className="col-md-4"><Input label="Tax Rate %" name="taxSlab1Rate" type="text" step="0.01" value={settings.taxSlab1Rate} onChange={handleChange} /></div>
              </div>
              <div className="row g-3 mt-2">
                <div className="col-md-4"><Input label="Above ₹" name="taxSlab2Limit" type="text" value={settings.taxSlab2Limit} onChange={handleChange} /></div>
                <div className="col-md-4"><Input label="Tax Rate %" name="taxSlab2Rate" type="text" step="0.01" value={settings.taxSlab2Rate} onChange={handleChange} /></div>
              </div>
              <div className="row g-3 mt-2">
                <div className="col-md-4 offset-md-4">
                  <Input label="Above Slab 2 Tax %" name="taxSlab3Rate" type="text" step="0.01" value={settings.taxSlab3Rate} onChange={handleChange} />
                </div>
              </div>
            </div>
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