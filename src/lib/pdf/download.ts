export async function downloadRecipesPdf(opts: {
  id?: string;
  ids?: string[];
  all?: boolean;
}) {
  const params = new URLSearchParams();
  if (opts.all) params.set('all', '1');
  else if (opts.ids && opts.ids.length > 0) params.set('ids', opts.ids.join(','));
  else if (opts.id) params.set('id', opts.id);
  else throw new Error('EMPTY_EXPORT');

  const response = await fetch(`/api/export/pdf?${params.toString()}`);
  if (!response.ok) throw new Error(`PDF_${response.status}`);

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const header = response.headers.get('Content-Disposition') ?? '';
  const encoded = header.match(/filename\*=UTF-8''([^;]+)/i);
  link.href = url;
  link.download = encoded ? decodeURIComponent(encoded[1]) : 'negroni.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
