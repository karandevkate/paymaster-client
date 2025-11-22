import React, { useEffect, useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  addPayrollConfiguration,
  fetchPayrollConfigurationByCompanyId,
  updatePayrollConfig,
  PayrollConfigurationRequestDto
} from '@/src/services/apiService';
import toast from 'react-hot-toast';
import axios from 'axios';

export const CompanySettingsPage: React.FC = () => {
  const storedCompanyId = localStorage.getItem('companyId');
  const [settings, setSettings] = useState<PayrollConfigurationRequestDto>({
    companyId: storedCompanyId,
    hraPercentage: 0,
    daPercentage: 0,
    pfPercentage: 0,
    taxSlab1Limit: 0,
    taxSlab1Percentage: 0,
    taxSlab2Limit: 0,
    taxSlab2Percentage: 0,
    taxSlab3Percentage: 0
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasConfig, setHasConfig] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedCompanyId = localStorage.getItem('companyId');
        const data = await fetchPayrollConfigurationByCompanyId(storedCompanyId);

        setSettings({
          companyId: data.companyId,
          hraPercentage: data.hraPercentage ?? 0,
          daPercentage: data.daPercentage ?? 0,
          pfPercentage: data.pfPercentage ?? 0,
          taxSlab1Limit: data.taxSlab1Limit ?? 0,
          taxSlab1Percentage: data.taxSlab1Percentage ?? 0,
          taxSlab2Limit: data.taxSlab2Limit ?? 0,
          taxSlab2Percentage: data.taxSlab2Percentage ?? 0,
          taxSlab3Percentage: data.taxSlab3Percentage ?? 0
        });
        setHasConfig(true);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setHasConfig(false);
          } else {
            setError(err.response?.data?.message || 'Failed to load configuration');
          }
        } else {
          setError('Unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    document.title = 'Company Settings - PayMaster';
    loadConfig();
  }, [storedCompanyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {

      if (!settings.companyId) {
        throw new Error('Company ID is required');
      }

      await addPayrollConfiguration(settings);
      setHasConfig(true);
      toast.success('Payroll configuration added successfully!');
    } catch (err: any) {
      console.error('Add failed:', err);
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Failed to add configuration'
          : err.message || 'Failed to add configuration';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!settings.companyId) {
        throw new Error('Company ID is required');
      }

      await updatePayrollConfig(settings);
      toast.success('Payroll configuration updated successfully!');
    } catch (err: any) {
      console.error('Update failed:', err);
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Failed to update configuration'
          : err.message || 'Failed to update configuration';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-600">Loading configuration...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10 mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Company Payroll Configuration</h2>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      <form className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gray-50 p-8 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">
              Allowances & Deductions (%)
            </h3>
            <div className="space-y-6">
              <Input
                label="HRA %"
                name="hraPercentage"
                type="number"
                value={settings.hraPercentage}
                onChange={handleChange}
              />
              <Input
                label="DA %"
                name="daPercentage"
                type="number"
                value={settings.daPercentage}
                onChange={handleChange}
              />
              <Input
                label="PF %"
                name="pfPercentage"
                type="number"
                value={settings.pfPercentage}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">
              Income Tax Slabs
            </h3>
            <div className="space-y-6">
              <Input
                label="Slab 1 Limit (₹)"
                name="taxSlab1Limit"
                type="number"
                value={settings.taxSlab1Limit}
                onChange={handleChange}
              />
              <Input
                label="Slab 1 Tax %"
                name="taxSlab1Percentage"
                type="number"
                value={settings.taxSlab1Percentage}
                onChange={handleChange}
              />
              <Input
                label="Slab 2 Limit (₹)"
                name="taxSlab2Limit"
                type="number"
                value={settings.taxSlab2Limit}
                onChange={handleChange}
              />
              <Input
                label="Slab 2 Tax %"
                name="taxSlab2Percentage"
                type="number"
                value={settings.taxSlab2Percentage}
                onChange={handleChange}
              />
              <Input
                label="Above Slab 2 Tax %"
                name="taxSlab3Percentage"
                type="number"
                value={settings.taxSlab3Percentage}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-8 border-t">
          {!hasConfig ? (
            <Button onClick={handleAdd} isLoading={saving} className="px-8">
              Add Configuration
            </Button>
          ) : (
            <Button onClick={handleUpdate} isLoading={saving} className="px-8">
              Update Configuration
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
