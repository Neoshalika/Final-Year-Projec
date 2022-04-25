package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Loanrepayment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface LoanrepaymentDao extends JpaRepository<Loanrepayment, Integer>{
    @Query("select new Loanrepayment (l.id,l.code,l.loan,l.amount) from Loanrepayment l")
    Page<Loanrepayment> findAllBasic(PageRequest pageRequest);

    Loanrepayment findByCode(String code);
}