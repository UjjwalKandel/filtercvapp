from django.db.models import constraints
from filtercv.forms import UploadFilesAndTags
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .find_certain_word import find_in_pdfBuffer

# Create your views here.

def home(request):
    print(request.method)
    if request.method == "GET":
        context = {'title': 'Homepage'}
        return render(request, 'filtercv/home.j2', context)

    elif request.method == "POST":
        
        result = {}
        words = request.POST['tags'].split(',')
        words = request.POST.getlist('tags')
        print(request.POST['tags'])

        for file in request.FILES.getlist('files'):
            local_result = set()
            for word in words:
                if find_in_pdfBuffer(file, word):
                    local_result.add(word)

            if len(local_result) != 0:
                result[file.name] = set(local_result)
                result[file.name] = list(result[file.name])

        context = {'title': 'Homepage'}
        context['result'] = result
        context['words'] = words
        return JsonResponse(context)

