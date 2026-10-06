document.addEventListener('DOMContentLoaded', async () => {
    const status = document.getElementById('certificateStatus');
    const empty = document.getElementById('certificateEmpty');
    const list = document.getElementById('certificateList');
    const preview = document.getElementById('certificatePreview');
    let activeCertificate = null;
    let qrDataUrl = null;

    const gradeFor = (percentage) => percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : 'Not Qualified';
    const formatDate = (date) => new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date));

    const showCertificate = async (certificate) => {
        activeCertificate = certificate;
        qrDataUrl = null;
        const id = certificate.certificateId;
        const verificationUrl = certificate.verificationUrl || `http://localhost:5000/api/certificates/verify/${encodeURIComponent(id)}`;
        document.getElementById('certificateStudentName').textContent = certificate.studentName || 'Student';
        document.getElementById('certificateScore').textContent = `${certificate.percentage}%`;
        document.getElementById('certificateGrade').textContent = certificate.grade || gradeFor(certificate.percentage);
        document.getElementById('certificateDate').textContent = formatDate(certificate.issuedAt || certificate.date || Date.now());
        document.getElementById('certificateId').textContent = id;
        document.getElementById('verifyCertificate').href = verificationUrl;
        const qrImage = document.getElementById('certificateQr');
        qrImage.removeAttribute('src');
        if (window.QRCode) {
            try {
            const qrCanvas = document.createElement('div');
            new window.QRCode(qrCanvas, { text: verificationUrl, width: 360, height: 360, colorDark: '#17253b', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.H });
            const canvas = qrCanvas.querySelector('canvas');
            if (!canvas) throw new Error('QR canvas unavailable');
            qrDataUrl = canvas.toDataURL('image/png');
                qrImage.src = qrDataUrl;
            } catch (error) {
                document.getElementById('certificateActionStatus').textContent = 'QR code could not be generated. The verification link is still available.';
            }
        } else {
            document.getElementById('certificateActionStatus').textContent = 'QR library unavailable. Use Verify Certificate to open the verification record.';
        }
        preview.hidden = false;
        preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    try {
        const response = await getCertificates();
        const certificates = response.data || [];
        status.hidden = true;
        if (!certificates.length) {
            empty.hidden = false;
            return;
        }
        certificates.forEach((certificate, index) => {
            const card = document.createElement('article');
            card.className = 'certificate-card';
            const title = document.createElement('p');
            title.className = 'dashboard-eyebrow';
            title.textContent = 'AI-SAKSHARA ACHIEVEMENT';
            const heading = document.createElement('h2');
            heading.textContent = 'Certificate of AI Awareness';
            const student = document.createElement('p');
            student.textContent = certificate.studentName || 'Student';
            const detail = document.createElement('p');
            detail.textContent = `${certificate.percentage}% · Grade ${certificate.grade || gradeFor(certificate.percentage)} · ${formatDate(certificate.issuedAt)}`;
            const view = document.createElement('button');
            view.type = 'button';
            view.className = 'btn btn-outline';
            view.textContent = 'View certificate';
            view.addEventListener('click', () => showCertificate(certificate));
            card.append(title, heading, student, detail, view);
            list.append(card);
            if (index === 0) showCertificate(certificate);
        });
    } catch (error) {
        status.textContent = error.message || 'Unable to load certificates right now. Please try again.';
    }

    document.getElementById('printCertificate').addEventListener('click', () => window.print());
    document.getElementById('downloadCertificate').addEventListener('click', async () => {
        const statusMessage = document.getElementById('certificateActionStatus');
        const button = document.getElementById('downloadCertificate');
        if (!activeCertificate) return;
        if (!window.jspdf?.jsPDF) {
            statusMessage.textContent = 'PDF export is unavailable. Use Print Certificate and choose Save as PDF.';
            return;
        }

        button.disabled = true;
        statusMessage.textContent = 'Preparing your certificate PDF...';
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
            const width = 297;
            const height = 210;
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, width, height, 'F');
            pdf.setDrawColor(190, 151, 69);
            pdf.setLineWidth(1.4);
            pdf.rect(7, 7, width - 14, height - 14);
            pdf.setDrawColor(50, 61, 123);
            pdf.setLineWidth(0.4);
            pdf.rect(11, 11, width - 22, height - 22);

            pdf.setTextColor(47, 58, 119);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(16);
            pdf.text('AI-SAKSHARA', width / 2, 29, { align: 'center' });
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8.5);
            pdf.setTextColor(90, 98, 113);
            pdf.text('AI Awareness & Digital Intelligence Platform', width / 2, 35, { align: 'center' });
            pdf.setDrawColor(190, 151, 69);
            pdf.line(100, 42, 197, 42);

            pdf.setTextColor(33, 43, 82);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(20);
            pdf.text('CERTIFICATE OF AI AWARENESS', width / 2, 56, { align: 'center' });
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(76, 83, 98);
            pdf.text('This certificate is proudly presented to', width / 2, 68, { align: 'center' });
            pdf.setFont('times', 'bold');
            pdf.setFontSize(27);
            pdf.setTextColor(35, 45, 98);
            pdf.text(activeCertificate.studentName || 'Student', width / 2, 84, { align: 'center', maxWidth: 235 });
            pdf.setDrawColor(190, 151, 69);
            pdf.line(63, 89, 234, 89);

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9.5);
            pdf.setTextColor(76, 83, 98);
            const description = 'For successfully completing the AI Awareness Quiz and demonstrating knowledge of Artificial Intelligence, AI technologies, responsible AI usage, and AI safety.';
            pdf.text(pdf.splitTextToSize(description, 210), width / 2, 100, { align: 'center' });

            pdf.setTextColor(90, 98, 113);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.text('SCORE', 77, 127, { align: 'center' });
            pdf.text('GRADE', 148, 127, { align: 'center' });
            pdf.text('DATE', 220, 127, { align: 'center' });
            pdf.setTextColor(34, 46, 100);
            pdf.setFontSize(15);
            pdf.text(`${activeCertificate.percentage}%`, 77, 136, { align: 'center' });
            pdf.text(activeCertificate.grade || gradeFor(activeCertificate.percentage), 148, 136, { align: 'center' });
            pdf.setFontSize(10);
            pdf.text(formatDate(activeCertificate.issuedAt || activeCertificate.date), 220, 136, { align: 'center' });

            pdf.setDrawColor(95, 103, 119);
            pdf.setLineWidth(0.35);
            pdf.line(34, 165, 93, 165);
            pdf.setTextColor(42, 50, 68);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(8.5);
            pdf.text('Quiz Coordinator', 63.5, 171, { align: 'center' });
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(105, 111, 123);
            pdf.setFontSize(7.5);
            pdf.text('AI-Sakshara', 63.5, 176, { align: 'center' });

            if (qrDataUrl) pdf.addImage(qrDataUrl, 'PNG', 242, 145, 28, 28, undefined, 'FAST');
            pdf.setFontSize(6.8);
            pdf.setTextColor(63, 72, 94);
            pdf.text(activeCertificate.certificateId, 256, 178, { align: 'center' });
            pdf.setFontSize(7.2);
            pdf.setTextColor(102, 108, 120);
            pdf.text(`Issued by ${activeCertificate.issuedBy || 'AI-Sakshara'} · Verify at ${activeCertificate.verificationUrl || ''}`, width / 2, 193, { align: 'center', maxWidth: 255 });
            pdf.save(`AI-Sakshara-Certificate-${activeCertificate.certificateId}.pdf`);
            statusMessage.textContent = 'Your A4 landscape certificate PDF is ready.';
        } catch (error) {
            statusMessage.textContent = 'Unable to create the PDF. Use Print Certificate and choose Save as PDF.';
        } finally {
            button.disabled = false;
        }
    });
});
