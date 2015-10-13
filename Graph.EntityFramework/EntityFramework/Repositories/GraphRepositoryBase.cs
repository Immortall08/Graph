using Abp.Domain.Entities;
using Abp.EntityFramework;
using Abp.EntityFramework.Repositories;

namespace Graph.EntityFramework.Repositories
{
    public abstract class GraphRepositoryBase<TEntity, TPrimaryKey> : EfRepositoryBase<GraphDbContext, TEntity, TPrimaryKey>
        where TEntity : class, IEntity<TPrimaryKey>
    {
        protected GraphRepositoryBase(IDbContextProvider<GraphDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }

        //add common methods for all repositories
    }

    public abstract class GraphRepositoryBase<TEntity> : GraphRepositoryBase<TEntity, int>
        where TEntity : class, IEntity<int>
    {
        protected GraphRepositoryBase(IDbContextProvider<GraphDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }

        //do not add any method here, add to the class above (since this inherits it)
    }
}
