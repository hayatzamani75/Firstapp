<?php

namespace App\Http\Controllers;

use App\Http\Requests\Service\CreateServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function view(): Response
    {
        $services = Service::query()->latest()->paginate(12);

        return Inertia::render('Service/View', [
            'services' => $services,
        ]);
    }

    public function store(CreateServiceRequest $request)
    {
        Service::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
        ]);

        return to_route('service.view')->with('success', 'Service created successfully!');
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        $service->update($request->validated());

        return to_route('service.view')->with('success', 'Service updated successfully!');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return to_route('service.view')->with('success', 'Service deleted successfully!');
    }
}
