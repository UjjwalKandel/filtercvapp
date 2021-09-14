from django.db.models import constraints
from filtercv.forms import UploadFilesAndTags
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .find_certain_word import find_in_pdfBuffer

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
                local_result = set()
                for word in words:
                    try:
                        if find_in_pdfBuffer(file, word):
                            local_result.add(word)
                    except:
                        context['error'] = 'Something went wrong when reading pdf files'
                        return JsonResponse(context)

                if len(local_result) != 0:
                    result[file.name] = set(local_result)
                    result[file.name] = list(result[file.name])

        context['result'] = result
        context['words'] = words
        return JsonResponse(context)

