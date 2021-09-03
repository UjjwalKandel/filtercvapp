from django import forms

class UploadFilesAndTags(forms.Form):
    tags = forms.CharField(max_length=150)
    # tagss = forms.JSONField()
    files = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))