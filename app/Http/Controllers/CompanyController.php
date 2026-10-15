<?php

namespace App\Http\Controllers;

use App\Http\Requests\Company\CreateCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function view(): Response
    {
        $companies = Company::query()->latest()->paginate(12);

        return Inertia::render('Company/View', [
            'companies' => $companies,
        ]);
    }

    public function store(CreateCompanyRequest $request)
    {
        Company::create([
            'name' => $request->name,
            'type' => $request->type,
            'address' => $request->address,
            'user_id' => Auth::id(),
        ]);

        return to_route('company.view')->with('success', 'Company created successfully!');
    }

    public function update(UpdateCompanyRequest $request, Company $company)
    {
        $company->update($request->validated());

        return to_route('company.view')->with('success', 'Company updated successfully!');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return to_route('company.view')->with('success', 'Company deleted successfully!');
    }
}
