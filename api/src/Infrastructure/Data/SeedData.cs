using Sovos.Invoiceware.Domain.Entities.Documents;

namespace Sovos.Invoiceware.Infrastructure.Data;

public static class SeedData
{
    public static void Seed(AppDbContext db)
    {
        if (db.Set<Document>().Any()) return;

        var docs = new List<Document>();
        var rng = new Random(42);
        var statuses = new[] { ("200", "Autorizada", 1), ("539", "Rejeitada", 2), ("100", "Processando", 0) };
        var owners = new[] { ("COMP-001", "12345678000195"), ("COMP-002", "20-12345678-9"), ("COMP-004", "98765432000100") };
        var docTypes = new[] { "ide", "ide", "ide", "CFDI", "DTE", "NFSe", "cteProc" };

        for (var i = 0; i < 50; i++)
        {
            var dt = docTypes[i % docTypes.Length];
            var (sc, sd, sem) = statuses[rng.Next(statuses.Length)];
            var (ow, owsc) = owners[rng.Next(owners.Length)];
            var docId = $"DOC-{10000 + i:D5}";

            var doc = new Document
            {
                DocumentId = docId, DocumentType = dt, ProcessType = rng.Next(2),
                CreationDate = DateTime.UtcNow.AddDays(-rng.Next(30)).AddHours(-rng.Next(24)),
                Owner = ow, OwnerSearchCode = owsc,
                Receiver = "COMP-RCV-001", ReceiverSearchCode = "11111111000100",
                StatusId = int.Parse(sc), StatusCode = sc, StatusDescription = sd, Semaphore = sem,
                ConfigVersion = "4.0", ProcessVersion = "1.0", Historic = 0,
                TagVarchar1 = owsc, TagVarchar2 = $"Empresa {i}", TagVarchar3 = $"35250{docId}",
                TagInt1 = 1, TagInt2 = 1000 + i, TagFloat1 = Math.Round(rng.NextDouble() * 50000, 2),
                TagDate1 = DateTime.UtcNow.AddDays(-rng.Next(30)),
                TagInt5 = rng.Next(3),
                HistoryFlows =
                [
                    new() { HistoryId = i * 10 + 1, CreationDate = DateTime.UtcNow.AddDays(-rng.Next(30)), ProcessName = "SendToSEFAZ", FlowId = 100 + i, StatusId = int.Parse(sc), StatusCode = sc, StatusDescription = sd, Semaphore = sem, QueueName = "NFEAuthorize1" },
                    new() { HistoryId = i * 10 + 2, CreationDate = DateTime.UtcNow.AddDays(-rng.Next(30)).AddMinutes(1), ProcessName = "ValidateXML", FlowId = 200 + i, StatusId = 100, StatusCode = "100", StatusDescription = "Validado", Semaphore = 1, QueueName = "Validate1" },
                ],
                Errors = sem == 2 ? [new() { ErrorId = i * 10 + 1, CreationDate = DateTime.UtcNow.AddDays(-rng.Next(30)), Method = "NFEAuthorize", Code = sc, Message = $"Rejeição: erro teste {i}" }] : [],
                Attachments =
                [
                    new() { AttachmentId = i * 10 + 1, AttachmentName = "nfeProc", Type = "Text", CreationDate = DateTime.UtcNow.AddDays(-rng.Next(30)), ContentType = "application/xml", Content = $"<?xml version=\"1.0\"?><nfeProc><infNFe Id=\"{docId}\"><ide/></infNFe></nfeProc>" },
                    new() { AttachmentId = i * 10 + 2, AttachmentName = "DANFE", Type = "Data", CreationDate = DateTime.UtcNow.AddDays(-rng.Next(30)), ContentType = "application/pdf", Content = "PDF_BINARY_CONTENT" },
                ],
                Actions =
                [
                    new() { ActionId = i * 10 + 1, CreationDate = DateTime.UtcNow.AddDays(-rng.Next(30)), Username = "admin", ActionDescription = "Document Created" },
                    new() { ActionId = i * 10 + 2, CreationDate = DateTime.UtcNow.AddDays(-rng.Next(30)).AddMinutes(1), Username = "system", ActionDescription = sd },
                ],
                Messages =
                [
                    new() { MessageId = i * 10 + 1, CreationDate = DateTime.UtcNow.AddDays(-rng.Next(30)), MessageType = "Response", Code = sc, Description = sd, Sent = true, Error = sem == 2, ProcessType = "Authorization" },
                ],
                Flags =
                [
                    new() { FlagId = i * 10 + 1, FlagName = "IsAuthorized", FlagValue = (sem == 1).ToString().ToLower() },
                    new() { FlagId = i * 10 + 2, FlagName = "HasPDF", FlagValue = "true" },
                ],
            };
            docs.Add(doc);
        }

        db.Set<Document>().AddRange(docs);
        db.SaveChanges();
    }
}
