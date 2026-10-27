using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sovos.Invoiceware.Domain.Entities.Documents;

namespace Sovos.Invoiceware.Infrastructure.Data;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> b)
    {
        b.HasKey(e => e.DocumentId);
        b.HasMany(e => e.HistoryFlows).WithOne(e => e.Document).HasForeignKey(e => e.DocumentId);
        b.HasMany(e => e.Errors).WithOne(e => e.Document).HasForeignKey(e => e.DocumentId);
        b.HasMany(e => e.Attachments).WithOne(e => e.Document).HasForeignKey(e => e.DocumentId);
        b.HasMany(e => e.Actions).WithOne(e => e.Document).HasForeignKey(e => e.DocumentId);
        b.HasMany(e => e.Messages).WithOne(e => e.Document).HasForeignKey(e => e.DocumentId);
        b.HasMany(e => e.Flags).WithOne(e => e.Document).HasForeignKey(e => e.DocumentId);
    }
}

public class HistoryFlowConfiguration : IEntityTypeConfiguration<DocumentHistoryFlow>
{
    public void Configure(EntityTypeBuilder<DocumentHistoryFlow> b) => b.HasKey(e => e.HistoryId);
}

public class ErrorConfiguration : IEntityTypeConfiguration<DocumentError>
{
    public void Configure(EntityTypeBuilder<DocumentError> b) => b.HasKey(e => e.ErrorId);
}

public class AttachmentConfiguration : IEntityTypeConfiguration<DocumentAttachment>
{
    public void Configure(EntityTypeBuilder<DocumentAttachment> b) => b.HasKey(e => e.AttachmentId);
}

public class ActionConfiguration : IEntityTypeConfiguration<DocumentAction>
{
    public void Configure(EntityTypeBuilder<DocumentAction> b) => b.HasKey(e => e.ActionId);
}

public class MessageConfiguration : IEntityTypeConfiguration<DocumentMessage>
{
    public void Configure(EntityTypeBuilder<DocumentMessage> b) => b.HasKey(e => e.MessageId);
}

public class FlagConfiguration : IEntityTypeConfiguration<DocumentFlag>
{
    public void Configure(EntityTypeBuilder<DocumentFlag> b) => b.HasKey(e => e.FlagId);
}
