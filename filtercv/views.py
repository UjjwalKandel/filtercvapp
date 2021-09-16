from django.db.models import constraints
from filtercv.forms import UploadFilesAndTags
from django.shortcuts import render
from django.http import JsonResponse
from .find_certain_word import find_in_pdf_buffer

# Create your views here.

def home(request):
    context = {'title': 'Homepage'}
    if request.method == "GET":
        return render(request, 'filtercv/home.j2', context)

    elif request.method == "POST":
        result = {}
        try:
            words = request.POST.getlist('tags')
            files = request.FILES.getlist('files')
        except:
            context['error'] = 'Invalid request. Check your input'
            return JsonResponse(context)

        if not files:
            context['error'] = 'No file provided'
        elif not words:
            context['error'] = 'No tag provided'
        else:
            context['error'] = False
            for file in files:
                try:
                    found_response = find_in_pdf_buffer(file, words)
                    print(found_response)
                    if len(found_response) != 0:
                        result[file.name] = found_response
                except:
                    context['error'] = 'Something went wrong when reading pdf files'
                    return JsonResponse(context)

        context['result'] = result
        context['words'] = words
        return JsonResponse(context)

